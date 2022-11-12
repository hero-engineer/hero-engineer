import { useCallback, useState } from 'react'
import { Div, DivProps } from 'honorable'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

import xor from '../../../utils/xor'

type RetractablePanelProps = DivProps & {
  defaultOpen?: boolean
  direction: 'left' | 'right' | string
}

function RetractablePanel({ direction, defaultOpen = false, children, ...props }: RetractablePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  const toggleOpen = useCallback(() => setOpen(x => !x), [])

  return (
    <Div
      position="relative"
      width={open ? 'fit-content' : 0}
      height="100%"
      backgroundColor="background-light"
      borderLeft={direction === 'left' ? null : '1px solid border'}
      borderRight={direction === 'right' ? null : '1px solid border'}
      {...props}
    >
      <Div
        position="absolute"
        top={0}
        right={direction === 'right' ? 'calc(100% + 1px)' : null}
        left={direction === 'left' ? 'calc(100% + 1px)' : null}
        backgroundColor="background-light"
        onClick={toggleOpen}
        borderLeft={direction === 'left' ? null : '1px solid border'}
        borderRight={direction === 'right' ? null : '1px solid border'}
        borderBottom="1px solid border"
        cursor="pointer"
        p={0.5}
      >
        {xor(direction === 'left', open) ? <MdChevronRight /> : <MdChevronLeft />}
      </Div>
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
