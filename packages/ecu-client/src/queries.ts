export const HierarchyQuery = `
  query ($sourceComponentId: String!, $hierarchyIds: [String!]!) {
    hierarchy (sourceComponentId: $sourceComponentId, hierarchyIds: $hierarchyIds) {
      label
      hierarchyId
      componentAddress
    }
  }
`

export const ComponentsQuery = `
  query {
    components {
      address
      payload {
        name
        path
        relativePath
      }
    }
  }
`

export const ComponentQuery = `
  query ($id: String!){
    component (id: $id) {
      address
      payload {
        name
        path
        relativePath
      }
    }
  }
`

export const CreateComponentMutation = `
  mutation ($name: String!) {
    createComponent (name: $name) {
      address
    }
  }
`

export const AddComponentMutation = `
  mutation ($sourceComponentId: String!, $targetComponentId: String!, $hierarchyIds: [String!]!, $hierarchyPosition: HierarchyPosition!) {
    addComponent (sourceComponentId: $sourceComponentId, targetComponentId: $targetComponentId, hierarchyIds: $hierarchyIds, hierarchyPosition: $hierarchyPosition) {
      address
    }
  }
`

export const DeleteComponentMutation = `
  mutation ($sourceComponentId: String!, $hierarchyIds: [String!]!) {
    deleteComponent (sourceComponentId: $sourceComponentId, hierarchyIds: $hierarchyIds) {
      address
    }
  }
`
