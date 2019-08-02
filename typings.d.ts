export interface ItemInterface {
  id?: UUID
  label: String,
  parentId?: UUID,
  value?: String,
  userIsWriter?: boolean
}
