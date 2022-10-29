import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import EditionContext from '../contexts/EditionContext'

import useForkedRef from './useForkedRef'
import useHierarchyId from './useHierarchyId'

type DropResult = {
  hierarchyIds: string[]
}

function getHierarchyIds(element: EventTarget | HTMLElement) {
  const hierarchyIds = []

  let currentElement = element as HTMLElement | null

  while (currentElement) {
    const id = currentElement.getAttribute('data-ecu-hierarchy')

    if (!id) break

    hierarchyIds.push(id)
    currentElement = currentElement.parentElement
  }

  return hierarchyIds.reverse()
}

function useEditionProps<T>(id: string, className = '') {
  const rootRef = useRef<T>(null)
  const hierarchyId = useHierarchyId(id, rootRef)
  const { hierarchyIds, setHierarchyIds, dragHierarchyPosition, setDragHierarchyPosition } = useContext(EditionContext)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Node',
    item: () => ({ hierarchyIds: getHierarchyIds(rootRef.current as HTMLElement) }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult) {
        alert(`You dropped ${item.hierarchyIds} into ${dropResult.hierarchyIds}! ${dragHierarchyPosition}`)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }), [dragHierarchyPosition])

  const [{ canDrop, isOverCurrent }, drop] = useDrop(() => ({
    accept: 'Node',
    drop: (_item, monitor) => {
      const didDrop = monitor.didDrop()

      if (didDrop) return

      return { hierarchyIds: getHierarchyIds(rootRef.current as HTMLElement) }
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    hover: (_item: any, monitor) => {
      const mouse = monitor.getClientOffset()

      if (!mouse) return

      const rect = (rootRef.current as HTMLElement)?.getBoundingClientRect()

      if (!rect) return

      setDragHierarchyPosition(mouse.y - rect.top < rect.height / 3 ? 'before' : mouse.y - rect.top > 2 * rect.height / 3 ? 'after' : 'within')
    },
  }), [setDragHierarchyPosition])

  const ref = useForkedRef(rootRef, useForkedRef(drag, drop)) as Ref<T>

  const handleClick = useCallback((event: MouseEvent) => {
    if (event.detail < 2) return // Double click or more only

    event.stopPropagation()

    const ids = getHierarchyIds(event.target)

    setHierarchyIds(x => {
      const nextIds = []

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]

        nextIds.push(id)

        if (x[i] !== id) {
          break
        }
      }

      return nextIds
    })
  }, [setHierarchyIds])

  const generateClassName = useCallback(() => {
    let klassName = className

    if (hierarchyIds[hierarchyIds.length - 1] === hierarchyId) {
      klassName += ' ecu-selected'
    }

    if (isDragging) {
      klassName += ' ecu-drag-dragging'
    }

    if (canDrop && isOverCurrent) {
      klassName += ' ecu-drag-over'

      if (dragHierarchyPosition === 'before') {
        klassName += ' ecu-drag-before'
      }
      else if (dragHierarchyPosition === 'after') {
        klassName += ' ecu-drag-after'
      }
      else if (dragHierarchyPosition === 'within') {
        klassName += ' ecu-drag-within'
      }
    }

    return klassName.trim()
  }, [className, hierarchyIds, hierarchyId, isDragging, canDrop, isOverCurrent, dragHierarchyPosition])

  return {
    ref,
    hierarchyId,
    onClick: handleClick,
    className: generateClassName(),
  }
}

export default useEditionProps
