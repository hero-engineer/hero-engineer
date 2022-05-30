import { PropsWithChildren, useState } from 'react'
import {
  gql,
  useMutation,
  useQuery,
} from '@apollo/client'
import hotKeys from 'react-piano-keys'

import { Button, Div } from 'honorable'

type EcuOverlayProps = PropsWithChildren<unknown>

function EcuOverlay({ children }: EcuOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  hotKeys(document.documentElement, 'space', event => {
    event.preventDefault()
    setIsVisible(x => !x)
  })

  return (
    <>
      {isVisible && (
        <>
          <ComponentsList
            position="fixed"
            top={0}
            left={0}
          />
          <CreateComponentButton
            position="fixed"
            top={0}
            right={0}
          />
        </>
      )}
      {children}
    </>
  )
}

const COMPONENTS_LIST_QUERY = gql`
  query ComponentsList {
    components {
      id
      name
      content
    }
  }
`

function ComponentsList(props: any) {
  const { data, loading, error } = useQuery(COMPONENTS_LIST_QUERY)

  if (loading || error) {
    return null
  }

  return (
    <Div
      border="1px solid border"
      {...props}
    >
      {data.components.map((component: any) => (
        <ComponentListItem
          key={component.id}
          component={component}
        />
      ))}
    </Div>
  )
}

type ComponentListItemProps = {
  component: any
}

const ADD_COMPONENT_MUTATION = gql`
  mutation AddComponentMutation($name: String!) {
    addComponent(name: $name) {
      id
    }
  }
`

function ComponentListItem({ component }: ComponentListItemProps) {
  const [mutation] = useMutation(ADD_COMPONENT_MUTATION, {
    variables: {
      name: component.name,
    },
  })

  return (
    <Div onClick={() => mutation()}>
      {component.name}
    </Div>
  )
}

const CREATE_COMPONENT_MUTATION = gql`
  mutation CreateComponentMutation {
    createComponent {
      id
    }
  }
`

function CreateComponentButton(props: any) {
  const [mutation, { loading }] = useMutation(CREATE_COMPONENT_MUTATION)

  return (
    <Button
      onClick={() => mutation()}
      loading={loading}
      {...props}
    >
      Create Component
    </Button>
  )
}

export default EcuOverlay
