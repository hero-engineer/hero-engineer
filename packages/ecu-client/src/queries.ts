export const HierarchyQuery = `
  query ($sourceComponentAddress: String!) {
    hierarchy (sourceComponentAddress: $sourceComponentAddress)
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
  query ($sourceComponentAddress: String!){
    component (sourceComponentAddress: $sourceComponentAddress) {
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
  mutation ($sourceComponentAddress: String!, $targetComponentAddress: String!, $hierarchyIds: [String!]!, $hierarchyPosition: HierarchyPosition!, $componentDelta: Int!) {
    addComponent (sourceComponentAddress: $sourceComponentAddress, targetComponentAddress: $targetComponentAddress, hierarchyIds: $hierarchyIds, hierarchyPosition: $hierarchyPosition, componentDelta: $componentDelta) {
      address
    }
  }
`

export const DeleteComponentMutation = `
  mutation ($sourceComponentAddress: String!, $hierarchyIds: [String!]!, $componentDelta: Int!) {
    deleteComponent (sourceComponentAddress: $sourceComponentAddress, hierarchyIds: $hierarchyIds, componentDelta: $componentDelta) {
      address
    }
  }
`

export const MoveComponentMutation = `
  mutation ($sourceComponentAddress: String!, $sourceHierarchyIds: [String!]!, $targetHierarchyIds: [String!]!, $hierarchyPosition: HierarchyPosition!) {
    moveComponent (sourceComponentAddress: $sourceComponentAddress, sourceHierarchyIds: $sourceHierarchyIds, targetHierarchyIds: $targetHierarchyIds, hierarchyPosition: $hierarchyPosition) {
      address
    }
  }
`
