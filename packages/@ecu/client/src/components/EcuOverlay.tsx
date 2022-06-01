import { PropsWithChildren, useEffect, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Div } from 'honorable'

import { PositionType } from '../types'

import EcuOverlayMenu from './EcuOverlayMenu'

type EcuOverlayProps = PropsWithChildren<unknown>

function EcuOverlay({ children }: EcuOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState<PositionType>({ x: 0, y: 0 })

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (!isVisible) {
        setMousePosition({ x: event.clientX, y: event.clientY })
      }
    }

    window.addEventListener('mousemove', handler)

    return () => {
      window.removeEventListener('mousemove', handler)
    }
  }, [isVisible])

  useEffect(() => {
    function handler(isKeyDown: boolean) {
      return (event: KeyboardEvent) => {
        // event.preventDefault()
        // event.stopImmediatePropagation()

        if (event.code === 'Backquote') {
          setIsVisible(isKeyDown)
        }
      }
    }

    const onKeyDown = handler(true)
    const onKeyUp = handler(false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

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
          <EcuOverlayMenu mousePosition={mousePosition} />
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
  mutation AddComponentMutation($name: String!, $index: String!, $position: String!) {
    addComponent(name: $name, index: $index, position: $position) {
      id
    }
  }
`

function ComponentListItem({ component }: ComponentListItemProps) {
  const [mutation] = useMutation(ADD_COMPONENT_MUTATION, {
    variables: {
      name: component.name,
      index: '0.0',
      position: 'before',
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
