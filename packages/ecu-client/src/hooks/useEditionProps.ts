import { MouseEvent, Ref, useCallback, useContext, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import EditionContext from '../contexts/EditionContext'

import useForkedRef from './useForkedRef'
import useHierarchyId from './useHierarchyId'

type DropResult = {
  hierarchyIds: string[]
}

const selectionStyles = {
  outline: '1px solid lightblue',
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

function useEditionProps<T>(id: string) {
  const rootRef = useRef<T>(null)
  const hierarchyId = useHierarchyId(id, rootRef)
  const { hierarchyIds, setHierarchyIds } = useContext(EditionContext)
  // const [hasDropped, setHasDropped] = useState(false)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Node',
    item: () => ({ hierarchyIds: getHierarchyIds(rootRef.current as HTMLElement) }),
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
  }))

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

  return {
    ref,
    hierarchyId,
    onClick: handleClick,
    style: {
      userSelect: 'none' as any,
      ...(hierarchyIds[hierarchyIds.length - 1] === hierarchyId ? selectionStyles : {}),
      ...(isDragging ? { opacity: 0.5 } : {}),
      ...(canDrop && isOverCurrent ? { backgroundColor: 'lightgreen' } : {}),
    },
  }
}

export default useEditionProps
