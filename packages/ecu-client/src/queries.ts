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
  mutation ($componentId: String!, $hierarchyIds: [String!]!, $hierarchyPosition: ComponentHierarchyPosition!) {
    addComponent (componentId: $componentId, hierarchyIds: $hierarchyIds, hierarchyPosition: $hierarchyPosition) {
      id
    }
  }
`
