export interface ItemInterface {
  id?: string
  label: string
  parentId?: string
  value?: string
  userIsWriter?: boolean
  relationshipId?: string
  timeCreated: Date,
  timeUpdated: Date
}
