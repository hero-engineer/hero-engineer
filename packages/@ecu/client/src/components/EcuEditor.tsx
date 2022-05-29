import { PropsWithChildren, Ref, forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { Div, useForkedRef } from 'honorable'

import EcuContext from '../contexts/EcuContext'

type EcuEditorProps = PropsWithChildren<{
  index: string
}>

function EcuEditorRef({ children, index }: EcuEditorProps, ref: Ref<any>) {
  const rootRef = useRef<HTMLDivElement>()
  const forkedRef = useForkedRef(ref, rootRef)
  const [ecu, setEcu] = useContext(EcuContext)
  const { dragHoveredIndex, dragMousePosition, dragRect } = ecu
  const [dragPlaceholderPosition, setDragPlaceholderPosition] = useState(null)

  useEffect(() => {
    if (!rootRef.current) return

    if (dragHoveredIndex === index) {
      const rect = rootRef.current.getBoundingClientRect()

      setDragPlaceholderPosition(dragMousePosition.y - rect.top < rect.height / 2 ? 'top' : 'bottom')

      return
    }

    setDragPlaceholderPosition(null)
  }, [dragHoveredIndex, index, dragMousePosition])

  const [{ handlerId }, drop] = useDrop({
    accept: 'component',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      if (!rootRef.current) {
        return
      }

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
      const dragRect = rootRef.current.getBoundingClientRect()

      setEcu(ecu => ({ ...ecu, dragRect }))
    }
  }, [isDragging, setEcu])

  // const opacity = isDragging ? 0 : 1
  drag(drop(rootRef))

  return (
    <Div
      ecu={index}
      ref={forkedRef}
    >
      {dragRect && dragPlaceholderPosition === 'top' && (
        <Div
          width={dragRect.width}
          height={dragRect.height}
          backgroundColor="chartreuse"
        />
      )}
      <Div
        p={0.5}
        border="1px solid gold"
        borderColor={ecu.hoveredIndex === index ? 'red' : 'gold'}
        onMouseEnter={() => setEcu(ecu => ({ ...ecu, hoveredIndex: index }))}
        onMouseLeave={() => setEcu(ecu => ({ ...ecu, hoveredIndex: null }))}
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
