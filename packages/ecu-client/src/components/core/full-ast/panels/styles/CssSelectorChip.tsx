import { useRef, useState } from 'react'
import { Div, useForkedRef } from 'honorable'
import { XYCoord, useDrag, useDrop } from 'react-dnd'
import { MdOutlineClose } from 'react-icons/md'

type DragObject = {
  selector: string
}

type DropResult = {
  selector: string
  isLeftDropZone: boolean
}

type DragCollectedProp = {
  offset: XYCoord | null
}

type DropCollectedProps = never

type CssSelectorChipPropsType = {
  selector: string
  isSelected: boolean
  onDiscard: () => void
  onSelect: () => void
  onDrop: (dragSelector: string, dropSelector: string, isLeftDropZone: boolean) => void
}

function CssSelectorChip({ selector, isSelected, onDiscard, onSelect, onDrop }: CssSelectorChipPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isLeftDropZone, setIsLeftDropZone] = useState(false)

  const [, drag] = useDrag<DragObject, DropResult, DragCollectedProp>(() => ({
    type: 'CssSelectorChip',
    item: () => ({ selector }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult && dropResult.selector !== selector) {
        onDrop(selector, dropResult.selector, dropResult.isLeftDropZone)
      }
    },
  }), [selector, onDrop])

  const [, drop] = useDrop<DragObject, DropResult, DropCollectedProps>(() => ({
    accept: 'CssSelectorChip',
    hover: (_item, monitor) => {
      const offset = monitor.getClientOffset()

      if (offset && rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect()
        const x = offset.x - rect.left

        setIsLeftDropZone(x < rect.width / 2)
      }
    },
    drop: (_item, monitor) => {
      if (monitor.didDrop()) return

      return {
        selector,
        isLeftDropZone,
      }
    },
  }), [selector, isLeftDropZone])

  const forkedRef = useForkedRef(rootRef, useForkedRef(drag, drop))

  return (
    <Div
      ref={forkedRef}
      xflex="x4"
      flexShrink={0}
      backgroundColor={isSelected ? 'primary' : 'background-light-light'}
      color={isSelected ? 'white' : 'text'}
      borderRadius="medium"
      p={0.25}
      minWidth={0}
      maxWidth="100%"
      cursor="pointer"
      userSelect="none"
    >
      <Div
        ellipsis
        onClick={onSelect}
        pr={0.25}
      >
        {selector}
      </Div>
      <Div
        xflex="x5"
        fontSize="0.75em"
        onClick={onDiscard}
      >
        <MdOutlineClose />
      </Div>
    </Div>
  )
}

export default CssSelectorChip
