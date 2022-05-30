import { PropsWithChildren, Ref, forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Div } from 'honorable'

import EcuContext from '../contexts/EcuContext'

type EcuEditorProps = PropsWithChildren<{
  index: string
}>

function EcuEditorRef({ children, index }: EcuEditorProps, ref: Ref<any>) {
  const childrenRef = useRef<HTMLDivElement>()
  const [ecu, setEcu] = useContext(EcuContext)
  const { dragHoveredIndex, dragMousePosition, dragRect } = ecu
  const [dragPlaceholderPosition, setDragPlaceholderPosition] = useState(null)

  useEffect(() => {
    if (!childrenRef.current) return

    if (dragHoveredIndex === index) {
      const rect = childrenRef.current.getBoundingClientRect()

      setDragPlaceholderPosition(dragMousePosition.y - rect.top < rect.height / 2 ? 'top' : 'bottom')

      return
    }

    setDragPlaceholderPosition(null)
  }, [dragHoveredIndex, index, dragMousePosition])

  const [, drop] = useDrop({
    accept: 'component',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      const dragIndex = item.index
      const dragHoveredIndex = index

      // Don't replace items with themselves
      // if (dragIndex === dragHoveredIndex) {
      //   return
      // }

      const dragMousePosition = monitor.getClientOffset()

      // console.log('dragHoveredIndex', dragHoveredIndex)

      setEcu(ecu => ({ ...ecu, dragIndex, dragHoveredIndex, dragMousePosition }))
      // Determine rectangle on screen

      // Time to actually perform the action

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // item.index = dragHoveredIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: () => ({ id: index, index }),
    collect: monitor => ({ isDragging: monitor.isDragging() }),
    end: () => {
      setDragPlaceholderPosition(null)
      setEcu(ecu => ({
        ...ecu,
        dragIndex: null,
        dragHoveredIndex: null,
        dragRect: null,
      }))
    },
  })

  useEffect(() => {
    if (isDragging) {
      const dragRect = childrenRef.current.getBoundingClientRect()

      setEcu(ecu => ({ ...ecu, dragRect }))
    }
  }, [isDragging, setEcu])

  drag(drop(childrenRef))

  return (
    <Div
      ecu={index}
      ref={ref}
    >
      {dragRect && dragPlaceholderPosition === 'top' && (
        <Div
          width={dragRect.width}
          height={dragRect.height}
          backgroundColor="chartreuse"
        />
      )}
      <Div
        ref={childrenRef}
        p={0.5}
        borderStyle="solid"
        borderWidth={1}
        borderColor={ecu.activeIndex === index ? 'black' : ecu.hoveredIndex === index ? 'red' : 'transparent'}
        onMouseEnter={() => setEcu(ecu => ({ ...ecu, hoveredIndex: index }))}
        onMouseLeave={() => setEcu(ecu => ({ ...ecu, hoveredIndex: null }))}
        onClick={() => setEcu(ecu => ({ ...ecu, activeIndex: index }))}
      >
        {children}
      </Div>
      {dragRect && dragPlaceholderPosition === 'bottom' && (
        <Div
          width={dragRect.width}
          height={dragRect.height}
          backgroundColor="pink"
        />
      )}
    </Div>
  )
}

export default forwardRef(EcuEditorRef)
