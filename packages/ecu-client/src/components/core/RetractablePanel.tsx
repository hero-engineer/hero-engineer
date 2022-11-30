import { ReactNode, useCallback } from 'react'
import { Button, Div, Tooltip } from 'honorable'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { CgDockLeft, CgDockRight } from 'react-icons/cg'

import { zIndexes } from '../../constants'

import usePersistedState from '../../hooks/usePersistedState'

import xor from '../../utils/xor'

type RetractablePanelItemType = {
  label: string
  icon: ReactNode
  children: ReactNode
}

type RetractablePanelPropsType = {
  height: string | number
  direction: 'left' | 'right' | string
  openPersistedStateKey: string
  defaultOpenIndex?: number
  items: RetractablePanelItemType[]
}

// A panel that can be opened and closed on the side of the screen
function RetractablePanel({ height, direction, openPersistedStateKey, defaultOpenIndex = -1, items }: RetractablePanelPropsType) {
  const [openIndex, setOpenIndex] = usePersistedState(openPersistedStateKey, defaultOpenIndex, (x: string) => parseInt(x))
  const [isDocked, setIsDocked] = usePersistedState(`${openPersistedStateKey}-is-docked`, false)

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
      height={height}
      maxHeight={height}
      backgroundColor="background-light"
    >
      <Div
        xflex="y2s"
        width={32}
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
        <Div flexGrow />
        <Tooltip
          label="Dock panel"
          placement={isLeft ? 'right' : 'left'}
        >
          <Button
            ghost
            toggled={isDocked}
            onClick={() => setIsDocked(x => !x)}
            borderTop="1px solid border"
          >
            {isLeft ? <CgDockLeft /> : <CgDockRight />}
          </Button>
        </Tooltip>
      </Div>
      {items.map(({ children }, index) => (
        <Div
          key={index}
          xflex="y2s"
          position={isDocked ? 'static' : 'absolute'}
          top={isDocked ? null : 0}
          left={isDocked ? null : isLeft ? '100%' : null}
          right={isDocked ? null : isRight ? '100%' : null}
          display={openIndex === index ? 'flex' : 'none'}
          width="fit-content"
          height="100%"
          maxHeight="100%"
          backgroundColor="background-light"
          borderRight={isLeft ? '1px solid border' : null}
          borderLeft={isRight ? '1px solid border' : null}
          overflowY="auto"
          zIndex={zIndexes.retractablePanel}
        >
          {children}
        </Div>
      ))}
    </Div>
  )
}

export default RetractablePanel
