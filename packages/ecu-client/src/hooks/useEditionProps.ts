import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDrag, useDrop } from 'react-dnd'

import HierarchyContext from '../contexts/HierarchyContext'
import DragAndDropContext from '../contexts/DragAndDropContext'

import getComponentRootHierarchyIds from '../helpers/getComponentRootHierarchyIds'
import isHierarchyOnComponent from '../helpers/isHierarchyOnComponent'

import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import areArraysEqual from '../utils/areArraysEqual'

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

function useEditionProps<T>(id: string, className = '', canBeEdited = false) {
  const { componentAddress = '' } = useParams()
  const rootRef = useRef<T>(null)
  const hierarchyId = useHierarchyId(id, rootRef)
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy, setShouldAdjustComponentDelta } = useContext(HierarchyContext)
  const { setDragAndDrop } = useContext(DragAndDropContext)
  const [edited, setEdited] = useState(false)

  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])

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
    canDrag: !edited,
  }), [setDragAndDrop, edited])

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
    if (edited) return

    event.stopPropagation()

    const ids = getHierarchyIds(event.target)

    if (areArraysEqual(hierarchyIds, ids) || (areArraysEqualAtStart(hierarchyIds, ids) && componentDelta < 0)) {
      if (canBeEdited && componentDelta === 0 && isHierarchyOnComponent(hierarchy, componentAddress)) {
        setEdited(true)

        return
      }

      setEditionSearchParams({
        componentDelta: Math.min(0, componentDelta + 1),
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
  }, [edited, hierarchyIds, componentDelta, setEditionSearchParams, setShouldAdjustComponentDelta, canBeEdited, hierarchy, componentAddress])

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

    if (componentDelta >= 0 && hierarchyIds.length && hierarchyId && hierarchyIds[hierarchyIds.length - 1] === hierarchyId) {
      klassName += ' ecu-selected'
    }

    if (isDragging) {
      klassName += ' ecu-drag'
    }

    if (canDrop && isOverCurrent) {
      klassName += ' ecu-drop'
    }

    if (edited) {
      klassName += ' ecu-edited'
    }

    return klassName.trim()
  }, [className, hierarchyIds, hierarchyId, componentDelta, componentRootHierarchyIds, isDragging, canDrop, isOverCurrent, edited])

  return {
    ref,
    hierarchyId,
    onClick: handleClick,
    className: generateClassName(),
    edited,
    setEdited,
  }
}

export default useEditionProps
