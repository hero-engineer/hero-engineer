export const ComponentsQuery = `
  query {
    components {
      id
      name
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
