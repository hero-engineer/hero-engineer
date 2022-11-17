import { ReactNode, useCallback } from 'react'
import { Div, DivProps, Tooltip } from 'honorable'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

import usePersistedState from '../../hooks/usePersistedState'

import xor from '../../utils/xor'

type RetractablePanelItemType = {
  label: string
  icon: ReactNode
  children: ReactNode
}

type RetractablePanelPropsType = DivProps & {
  direction: 'left' | 'right' | string
  openPersistedStateKey: string
  defaultOpenIndex?: number
  items: RetractablePanelItemType[]
}

function RetractablePanel({ direction, openPersistedStateKey, defaultOpenIndex = -1, items, ...props }: RetractablePanelPropsType) {
  const [openIndex, setOpenIndex] = usePersistedState(openPersistedStateKey, defaultOpenIndex, (x: string) => parseInt(x))

  const isLeft = direction === 'left'
  const isRight = direction === 'right'

  const toggleOpen = useCallback((openIndex: number) => setOpenIndex(x => x === openIndex ? -1 : openIndex), [setOpenIndex])

  function wrapWithTooltip(index: number, label: string, node: ReactNode) {
    if (openIndex === index) return node

    return (
      <Tooltip
        label={label}
        placement={isLeft ? 'right' : 'left'}
      >
        {node}
      </Tooltip>
    )
  }

  return (
    <Div
      position="relative"
      width={openIndex !== -1 ? 'fit-content' : 0}
      height="100%"
      backgroundColor="background-light"
      borderLeft={isLeft ? null : '1px solid border'}
      borderRight={isRight ? null : '1px solid border'}
      {...props}
    >
      {items.map(({ label, icon }, index) => wrapWithTooltip(
        index,
        label,
        <Div
          key={index}
          xflex="x5"
          position="absolute"
          width={32}
          height={32}
          top={openIndex === index ? 0 : `calc(${openIndex < index ? index : index + 1} * 32px)`}
          right={isRight ? 'calc(100% + 1px)' : null}
          left={isLeft ? 'calc(100% + 1px)' : null}
          backgroundColor="background-light"
          onClick={() => toggleOpen(index)}
          borderLeft={isLeft ? null : '1px solid border'}
          borderRight={isRight ? null : '1px solid border'}
          borderBottom="1px solid border"
          cursor="pointer"
          p={0.5}
        >
          {xor(isLeft, openIndex === index) ? isLeft ? icon || <MdChevronRight /> : <MdChevronRight /> : isRight ? icon || <MdChevronLeft /> : <MdChevronLeft />}
        </Div>,
      ))}
      {items.map(({ children }, index) => (
        <Div
          key={index}
          xflex="y2s"
          height="100%"
          display={openIndex === index ? 'block' : 'none'}
        >
          {children}
        </Div>
      ))}
    </Div>
  )
}

export default RetractablePanel
