import { MouseEvent, Ref, useCallback, useContext } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import EditionContext from '../contexts/EditionContext'

import useForkedRef from './useForkedRef'

type DropResult = {
  hierarchyIds: string[]
}

const selectionStyles = {
  outline: '1px solid lightblue',
}

function getHierarchyIds(element: EventTarget) {
  const hierarchyIds = []

  let currentElement = element as HTMLElement | null

  while (currentElement) {
    const id = currentElement.getAttribute('data-ecu')

    if (!id) break

    hierarchyIds.push(id)
    currentElement = currentElement.parentElement
  }

  return hierarchyIds.reverse()
}

function useEditionProps<T>(id: string) {
  const { hierarchyIds, setHierarchyIds } = useContext(EditionContext)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Node',
    item: { hierarchyIds },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult) {
        alert(`You dropped ${item.hierarchyIds} into ${dropResult.hierarchyIds}!`)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'Node',
    drop: () => ({ hierarchyIds }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const ref = useForkedRef(drag, drop) as Ref<T>

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

  return {
    ref,
    onClick: handleClick,
    style: {
      userSelect: 'none' as any,
      ...(hierarchyIds[hierarchyIds.length - 1] === id ? selectionStyles : {}),
      ...(isDragging ? { opacity: 0.5 } : {}),
      ...(canDrop && isOver ? { backgroundColor: 'lightgreen' } : {}),
    },
  }
}

export default useEditionProps
