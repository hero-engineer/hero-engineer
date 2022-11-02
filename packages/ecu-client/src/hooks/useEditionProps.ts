import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useMemo, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { HierarchyItemType } from '../types'

import HierarchyIdsContext from '../contexts/HierarchyIdsContext'
import HierarchyContext from '../contexts/HierarchyContext'
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

function getActualHierarchy(hierarchy: HierarchyItemType[], hierarchyDepth: number) {
  return hierarchy.slice(1, hierarchyDepth + 1)
}

function useEditionProps<T>(id: string, className = '') {
  const rootRef = useRef<T>(null)
  const hierarchyId = useHierarchyId(id, rootRef)
  const { hierarchyIds, setHierarchyIds, componentRootLimitedIds } = useContext(HierarchyIdsContext)
  const { hierarchy, setComponentDelta } = useContext(HierarchyContext)
  const { setDragAndDrop } = useContext(DragAndDropContext)

  // const actualHierarchy = useMemo(() => getActualHierarchy(hierarchy, hierarchyDepth), [hierarchy, hierarchyDepth])

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

    // TODO use setState fn
    const nextHierarchyIds: string[] = []

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]

      nextHierarchyIds.push(id)

      if (hierarchyIds[i] !== id) {
        break
      }
    }

    setHierarchyIds(nextHierarchyIds)
    setComponentDelta(x => x === 0 ? 0 : x + 1)
    // setHierarchyDepth(0)
  }, [hierarchyIds, setHierarchyIds, setComponentDelta])

  const generateClassName = useCallback(() => {
    let klassName = className

    // if (actualHierarchy.length === 0) {
    //   klassName += ' ecu-selected-root'
    // }

    // if (componentRootLimitedIds.some(x => x === id)) {
    //   klassName += ' ecu-selected-foo'
    // }

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
  // TODO remove next comment
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [className, hierarchyIds, hierarchyId, componentRootLimitedIds, id, isDragging, canDrop, isOverCurrent])

  return {
    ref,
    hierarchyId,
    onClick: handleClick,
    className: generateClassName(),
  }
}

export default useEditionProps
