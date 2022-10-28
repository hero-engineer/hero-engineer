export const ComponentsQuery = `
  query {
    components {
      id
      name
    }
  }
`

export const ComponentQuery = `
  query ($id: String!){
    component (id: $id) {
      id
      name
      file {
        id
        path
        relativePath
      }
    }
  }
`

export const CreateComponentMutation = `
  mutation ($name: String!) {
    createComponent (name: $name) {
      id
    }
  }
`

export const AddComponentMutation = `
  mutation ($sourceComponentId: String!, $targetComponentId: String!, $hierarchyIds: [String!]!, $hierarchyPosition: ComponentHierarchyPosition!) {
    addComponent (sourceComponentId: $sourceComponentId, targetComponentId: $targetComponentId, hierarchyIds: $hierarchyIds, hierarchyPosition: $hierarchyPosition) {
      id
    }
  }
`

export const DeleteComponentMutation = `
  mutation ($sourceComponentId: String!, $hierarchyIds: [String!]!) {
    deleteComponent (sourceComponentId: $sourceComponentId, hierarchyIds: $hierarchyIds) {
      id
    }
  }
`
