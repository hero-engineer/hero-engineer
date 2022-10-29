import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import EditionContext from '../contexts/EditionContext'
import DragAndDropContext from '../contexts/DragAndDropContext'

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
  const { hierarchyIds, setHierarchyIds } = useContext(EditionContext)
  const { setDragAndDrop } = useContext(DragAndDropContext)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Node',
    item: () => ({ hierarchyIds: getHierarchyIds(rootRef.current as HTMLElement) }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult) {
        setDragAndDrop({
          sourceHierarchyIds: item.hierarchyIds,
          targetHierarchyIds: dropResult.hierarchyIds,
        })
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }), [setDragAndDrop])

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
  }), [])

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
      klassName += ' ecu-drag'
    }

    if (canDrop && isOverCurrent) {
      klassName += ' ecu-drop'
    }

    return klassName.trim()
  }, [className, hierarchyIds, hierarchyId, isDragging, canDrop, isOverCurrent])

  return {
    ref,
    hierarchyId,
    onClick: handleClick,
    className: generateClassName(),
  }
}

export default useEditionProps
