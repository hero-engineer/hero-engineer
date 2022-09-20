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
      name
    }
  }
`
