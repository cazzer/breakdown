destroy-db:
	docker-compose down && \
	docker volume rm breakdown_pgdata && \
	rm -f pgdata && touch pgdata

run-db:
	docker-compose up &

run-schema:
	psql -d test -h localhost -W postgres -w -f database/schema.sql

insert-sample-data:
	psql -d test -h localhost -W postgres -w -f database/sample-data.sql

postgraphql:
	npx postgraphile -c postgres://postgres@localhost/test --schema public -e secret -w
