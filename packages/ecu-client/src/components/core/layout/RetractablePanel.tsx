import { useCallback, useState } from 'react'
import { Div, DivProps } from 'honorable'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

type RetractablePanelProps = DivProps & {
  direction: 'left' | 'right' | string
}

function xor(a: boolean, b: boolean) {
  return (a || b) && !(a && b)
}

function RetractablePanel({ children, direction, ...props }: RetractablePanelProps) {
  const [open, setOpen] = useState(false)

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
        right="calc(100% + 1px)"
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
      {children}
    </Div>
  )
}

export default RetractablePanel
