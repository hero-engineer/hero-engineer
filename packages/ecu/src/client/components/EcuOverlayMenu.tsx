import { useContext } from 'react'
import { gql } from '@apollo/client'
import { Div } from 'honorable'

import { MenuItemType, PositionType } from '../../types'
import client from '../client'

import EcuContext from '../contexts/EcuContext'

type EcuOverlayMenuProps = {
  mousePosition: PositionType
}

const REMOVE_COMPONENT_MUTATION = gql`
  mutation removeComponentMutation($index: String!) {
    removeComponent(index: $index) {
      id
    }
  }
`

// TODO plugin system
const menuItems: MenuItemType[] = [
  {
    label: 'Remove',
    on: 'component',
    handler: (ecu, setEcu) => {
      client.mutate({
        mutation: REMOVE_COMPONENT_MUTATION,
        variables: {
          index: ecu.component.index,
        },
      })
      .then(() => {
        setEcu(ecu => ({ ...ecu, activeIndex: null }))
      })
    },
  },
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.component.index)
    },
  },
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.component.index)
    },
  },
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.component.index)
    },
  },
]

function computePositions(items: MenuItemType[], mousePosition: PositionType) {
  let angle = 0
  const radius = 32

  return items.map(() => {
    const x = mousePosition.x + Math.cos(angle) * (radius + (angle % Math.PI < Math.PI / 6 ? radius : 0))
    const y = mousePosition.y + Math.sin(angle) * (radius + (angle % Math.PI < Math.PI / 6 ? radius : 0))

    angle += Math.PI * 2 / items.length

    return { x, y }
  })
}

function EcuOverlayMenu({ mousePosition }: EcuOverlayMenuProps) {
  const [ecu, setEcu] = useContext(EcuContext)
  const positions = computePositions(menuItems, mousePosition)

  return (
    <>
      {menuItems.map(({ label, handler }, i) => (
        <Div
          key={label + i}
          position="absolute"
          top={positions[i].y}
          left={positions[i].x}
        >
          <Div
            p={0.25}
            position="relative"
            top="-50%"
            left="-50%"
            border="1px solid border"
            backgroundColor="white"
            cursor="pointer"
            onClick={() => handler(ecu, setEcu)}
          >
            {label}
          </Div>
        </Div>
      ))}
    </>
  )
}

export default EcuOverlayMenu
