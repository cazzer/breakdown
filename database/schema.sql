create extension if not exists "postgis";
create extension if not exists "uuid-ossp";

create schema breakdown;
create role application_user;
alter role postgres SET search_path TO breakdown,public;
alter role application_user SET search_path TO breakdown,public;
grant application_user to postgres;

create table if not exists breakdown.users_and_groups (
  id uuid default uuid_generate_v4() not null primary key,
  name text,
  time_created timestamp without time zone default now() not null
);

create table if not exists breakdown.user_group_membership (
  member_id uuid references breakdown.users_and_groups(id),
  group_id uuid references breakdown.users_and_groups(id),
  time_created timestamp without time zone default now() not null
);

create unique index on breakdown.user_group_membership (member_id, group_id);

create table if not exists breakdown.items (
  id uuid default uuid_generate_v4() not null primary key,
  label text,
  location_created geography(pointz),
  public boolean default false,
  time_created timestamp without time zone default now() not null,
  value text
);

create type permission_role as enum (
  'reader',
  'writer'
);

create table if not exists breakdown.permissions (
  item_id uuid references breakdown.items(id) on delete cascade,
  user_or_group_id uuid references breakdown.users_and_groups(id) on delete cascade,
  role permission_role default 'reader' not null,
  time_created timestamp without time zone default now() not null
);

create index on breakdown.permissions(item_id);
create index on breakdown.permissions(user_or_group_id);

create unique index on breakdown.permissions (item_id, user_or_group_id);

grant all
on schema breakdown
to application_user;

grant all
on all tables in schema breakdown
to application_user;

alter table breakdown.items
enable row level security;

-- allows access to individual items
create policy item_owner
on breakdown.items
as permissive
for all
to application_user
using (
  items.public = true
  or exists(
    select item_id
    from breakdown.permissions
    where (
      permissions.user_or_group_id =
        any(regexp_split_to_array(current_setting('jwt.claims.roles'), ',')::uuid[])
      and permissions.item_id = items.id
    )
  )
)
with check (exists(
  select item_id
  from breakdown.permissions
  where (
    permissions.user_or_group_id =
      any(regexp_split_to_array(current_setting('jwt.claims.roles'), ',')::uuid[])
    and permissions.item_id = items.id
    and permissions.role = 'writer'
  )
));

-- allows new items to be inserted
create policy new_item
on breakdown.items
as permissive
for insert
to application_user
with check (true);

-- allows new items to be `returning`ed
create policy new_item_returning
on breakdown.items
as permissive
for select
to application_user
using (
  not exists(
    select item_id
    from breakdown.permissions
    where item_id = items.id
  )
);

-- allows access to the permissions themselves
create policy permission_owner
on breakdown.permissions
for all
to application_user
using (
  permissions.user_or_group_id =
      any(regexp_split_to_array(current_setting('jwt.claims.roles'), ',')::uuid[])
)
with check (
  permissions.user_or_group_id =
      any(regexp_split_to_array(current_setting('jwt.claims.roles'), ',')::uuid[])
);

-- warning, this will use the **first** role in the claims list as the writer
create or replace function insert_permission()
  returns trigger
  as $$
begin
  insert into permissions (item_id, user_or_group_id, role) values (
    new.id,
    (regexp_split_to_array(current_setting('jwt.claims.roles'), ',')::uuid[])[1],
    'writer'
  );
  return new;
end
$$ language plpgsql;

create trigger insert_permission_trigger
after insert
on breakdown.items
for each row
execute procedure insert_permission();

-- this is only neccessary if we plan to give SQL access to users
create or replace function create_role()
  returns trigger
  as $$
begin
  execute 'create role ' || quote_ident( new.id::text ) || ' inherit';
  execute 'grant application_user to ' || quote_ident( new.id::text );
  return new;
end
$$ language plpgsql;

create trigger insert_user_trigger
after insert
on breakdown.users_and_groups
for each row
execute procedure create_role();
