import { ReactNode, useCallback } from 'react'
import { Div, DivProps, Tooltip } from 'honorable'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

import usePersistedState from '../../hooks/usePersistedState'

import xor from '../../utils/xor'

type RetractablePanelPropsType = DivProps & {
  openPersistedStateKey: string
  openLabel: string
  defaultOpen?: boolean
  direction: 'left' | 'right' | string
  openIcon?: ReactNode
}

function RetractablePanel({ direction, openPersistedStateKey, openLabel, defaultOpen = false, openIcon = null, children, ...props }: RetractablePanelPropsType) {
  const [open, setOpen] = usePersistedState(openPersistedStateKey, defaultOpen)

  const toggleOpen = useCallback(() => setOpen(x => !x), [setOpen])
  const isLeft = direction === 'left'
  const isRight = direction === 'right'

  function wrapWithTooltip(node: ReactNode) {
    if (open) return node

    return (
      <Tooltip
        label={openLabel}
        placement={isLeft ? 'right' : 'left'}
      >
        {node}
      </Tooltip>
    )
  }

  return (
    <Div
      position="relative"
      width={open ? 'fit-content' : 0}
      height="100%"
      backgroundColor="background-light"
      borderLeft={isLeft ? null : '1px solid border'}
      borderRight={isRight ? null : '1px solid border'}
      {...props}
    >
      {wrapWithTooltip(
        <Div
          xflex="x5"
          position="absolute"
          top={0}
          right={isRight ? 'calc(100% + 1px)' : null}
          left={isLeft ? 'calc(100% + 1px)' : null}
          backgroundColor="background-light"
          onClick={toggleOpen}
          borderLeft={isLeft ? null : '1px solid border'}
          borderRight={isRight ? null : '1px solid border'}
          borderBottom="1px solid border"
          cursor="pointer"
          p={0.5}
        >
          {xor(direction === 'left', open) ? isLeft ? openIcon || <MdChevronRight /> : <MdChevronRight /> : isRight ? openIcon || <MdChevronLeft /> : <MdChevronLeft />}
        </Div>
      )}
      <Div
        xflex="y2s"
        height="100%"
        visibility={open ? 'visible' : 'hidden'}
      >
        {children}
      </Div>
    </Div>
  )
}

export default RetractablePanel
