import { PropsWithChildren, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'

import { PositionType } from '../../../types'

import EcuOverlayMenu from './EcuOverlayMenu'
import ComponentsList from './ComponentsList'

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
    function handler(event: KeyboardEvent) {
      // event.preventDefault()
      // event.stopImmediatePropagation()

      if (event.code === 'Backquote') {
        setIsVisible(x => !x)
      }
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
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
          <Button
            position="fixed"
            top={0}
            right="50vh"
            as={Link}
            to="/_ecu_"
          >
            Ecu
          </Button>
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
