import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useMemo, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import HierarchyContext from '../contexts/HierarchyContext'
import DragAndDropContext from '../contexts/DragAndDropContext'

import getFlattenedHierarchy from '../helpers/getFlattenedHierarchy'
import getComponentRootHierarchyIds from '../helpers/getComponentRootHierarchyIds'

import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'

import useForkedRef from './useForkedRef'
import useHierarchyId from './useHierarchyId'
import useEditionSearchParams from './useEditionSearchParams'

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
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy, setShouldAdjustComponentDelta } = useContext(HierarchyContext)
  const { setDragAndDrop } = useContext(DragAndDropContext)

  const totalHierarchy = useMemo(() => getFlattenedHierarchy(hierarchy, hierarchyIds), [hierarchy, hierarchyIds])
  const actualHierarchy = useMemo(() => totalHierarchy.slice(0, totalHierarchy.length + componentDelta), [totalHierarchy, componentDelta]) // TODO contextualize to save computation
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(actualHierarchy), [actualHierarchy])

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

    if (areArraysEqualAtStart(hierarchyIds, ids) && componentDelta < 0) {
      setEditionSearchParams({
        componentDelta: x => x + 1,
      })

      return
    }

    setEditionSearchParams({
      hierarchyIds: x => {
        const nextHierarchyIds: string[] = []

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i]

          nextHierarchyIds.push(id)

          if (x[i] !== id) {
            break
          }
        }

        return nextHierarchyIds
      },
    })

    setShouldAdjustComponentDelta(true)
  }, [hierarchyIds, componentDelta, setEditionSearchParams, setShouldAdjustComponentDelta])

  const generateClassName = useCallback(() => {
    let klassName = className

    if (componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyId)) {
      klassName += ' ecu-selected-root'

      const index = componentRootHierarchyIds.indexOf(hierarchyId)

      if (index === 0) {
        klassName += ' ecu-selected-root-first'
      }

      if (index === componentRootHierarchyIds.length - 1) {
        klassName += ' ecu-selected-root-last'
      }
    }

    if (componentDelta >= 0 && hierarchyIds[hierarchyIds.length - 1] === hierarchyId) {
      klassName += ' ecu-selected'
    }

    if (isDragging) {
      klassName += ' ecu-drag'
    }

    if (canDrop && isOverCurrent) {
      klassName += ' ecu-drop'
    }

    return klassName.trim()
  }, [className, hierarchyIds, hierarchyId, componentDelta, componentRootHierarchyIds, isDragging, canDrop, isOverCurrent])

  return {
    ref,
    hierarchyId,
    onClick: handleClick,
    className: generateClassName(),
  }
}

export default useEditionProps
