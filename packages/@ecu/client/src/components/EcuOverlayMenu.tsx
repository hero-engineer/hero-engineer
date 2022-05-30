import { useContext, useEffect, useState } from 'react'
import { Div } from 'honorable'

import { MenuItemType, PositionType } from '../types'

import EcuContext from '../contexts/EcuContext'

type EcuOverlayMenuProps = {
  mousePosition: PositionType
}

// TODO plugin system
const menuItems: MenuItemType[] = [
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.hoveredIndex)
    },
  },
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.hoveredIndex)
    },
  },
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.hoveredIndex)
    },
  },
  {
    label: 'Remove',
    on: 'component',
    handler: ecu => {
      console.log('remove', ecu.hoveredIndex)
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
  const [ecu] = useContext(EcuContext)
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
            onClick={() => handler(ecu)}
          >
            {label}
          </Div>
        </Div>
      ))}
    </>
  )
}

export default EcuOverlayMenu
