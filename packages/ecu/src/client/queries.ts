import { gql } from '@apollo/client'

export const DRAG_COMPONENT_MUTATION = gql`
  mutation dragComponentMutation($name: String!, $sourceIndex: String!, $targetIndex: String!, $position: String!) {
    dragComponent(name: $name, sourceIndex: $sourceIndex, targetIndex: $targetIndex, position: $position) {
      id
    }
  }
`
