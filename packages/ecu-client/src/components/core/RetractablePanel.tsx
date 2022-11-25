import { ReactNode, useCallback } from 'react'
import { Button, Div, Tooltip } from 'honorable'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

import usePersistedState from '../../hooks/usePersistedState'

import xor from '../../utils/xor'

type RetractablePanelItemType = {
  label: string
  icon: ReactNode
  children: ReactNode
}

type RetractablePanelPropsType = {
  direction: 'left' | 'right' | string
  openPersistedStateKey: string
  defaultOpenIndex?: number
  items: RetractablePanelItemType[]
}

// A panel that can be opened and closed on the side of the screen
function RetractablePanel({ direction, openPersistedStateKey, defaultOpenIndex = -1, items }: RetractablePanelPropsType) {
  const [openIndex, setOpenIndex] = usePersistedState(openPersistedStateKey, defaultOpenIndex, (x: string) => parseInt(x))

  const isLeft = direction === 'left'
  const isRight = direction === 'right'

  const toggleOpen = useCallback((openIndex: number) => setOpenIndex(x => x === openIndex ? -1 : openIndex), [setOpenIndex])

  function wrapWithTooltip(index: number, label: string, node: ReactNode) {
    if (openIndex === index) return node

    return (
      <Tooltip
        key={index}
        label={label}
        placement={isLeft ? 'right' : 'left'}
      >
        {node}
      </Tooltip>
    )
  }

  return (
    <Div
      xflex={isLeft ? 'x4s' : 'x40s'}
      position="relative"
      height="100%"
      backgroundColor="background-light"
    >
      <Div
        xflex="y2s"
        borderRight={isLeft ? '1px solid border' : null}
        borderLeft={isRight ? '1px solid border' : null}
      >
        {items.map(({ label, icon }, index) => wrapWithTooltip(
          index,
          label,
          <Button
            ghost
            key={index}
            onClick={() => toggleOpen(index)}
            borderBottom="1px solid border"
          >
            {xor(isLeft, openIndex === index) ? isLeft ? icon || <MdChevronRight /> : <MdChevronRight /> : isRight ? icon || <MdChevronLeft /> : <MdChevronLeft />}
          </Button>,
        ))}
      </Div>
      {items.map(({ children }, index) => (
        <Div
          key={index}
          position="absolute"
          top={0}
          left={isLeft ? '100%' : null}
          right={isRight ? '100%' : null}
          xflex="y2s"
          display={openIndex === index ? 'flex' : 'none'}
          width="fit-content"
          height="100%"
          backgroundColor="background-light"
          borderRight={isLeft ? '1px solid border' : null}
          borderLeft={isRight ? '1px solid border' : null}
          overflowY="auto"
        >
          {children}
        </Div>
      ))}
    </Div>
  )
}

export default RetractablePanel
