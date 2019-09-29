export interface ItemInterface {
  id?: string
  label: string
  parentId?: string
  value?: string
  userIsWriter?: boolean
  relationshipId?: string
  timeUpdated: Date
}
