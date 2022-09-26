export const ComponentsQuery = `
  query {
    components {
      id
      name
    }
  }
`

export const ComponentQuery = `
  query ($id: ID!){
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
  mutation ($componentId: ID!, $hierarchyId: ID!, $hierarchyPosition: ComponentHierarchyPosition!) {
    addComponent (componentId: $componentId, hierarchyId: $hierarchyId, hierarchyPosition: $hierarchyPosition) {
      id
    }
  }
`
