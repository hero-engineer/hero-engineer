import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDrag, useDrop } from 'react-dnd'

import { HierarchyItemType } from '../types'

import HierarchyContext from '../contexts/HierarchyContext'
import DragAndDropContext from '../contexts/DragAndDropContext'
import ContextualInformationContext from '../contexts/ContextualInformationContext'

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

function belongsToComponentRoot(hierarchy: HierarchyItemType[], componentRootHierarchyIds: string[], hierarchyId: string) {
  function traverseHierarchy(hierarchy: HierarchyItemType[], parentHierarchyIds: string[] = []): string[] | false {
    for (const item of hierarchy) {
      const nextParentHierarchyIds = [...parentHierarchyIds]

      if (item.hierarchyId === hierarchyId) return nextParentHierarchyIds

      if (item.hierarchyId) {
        nextParentHierarchyIds.push(item.hierarchyId)
      }

      if (item.children) {
        const childParentHierarchyIds = traverseHierarchy(item.children, nextParentHierarchyIds)

        if (childParentHierarchyIds) return childParentHierarchyIds
      }
    }

    return false
  }

  const parentHierarchyIds = traverseHierarchy(hierarchy)

  if (parentHierarchyIds) {
    return parentHierarchyIds.some(x => componentRootHierarchyIds.includes(x))
  }

  return false
}

function useEditionProps<T extends HTMLElement>(ecuId: string, className = '', canBeEdited = false) {
  const { componentAddress = '' } = useParams()
  const rootRef = useRef<T>(null)
  const hierarchyId = useHierarchyId(ecuId, rootRef)
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy, setShouldAdjustComponentDelta } = useContext(HierarchyContext)
  const { setDragAndDrop } = useContext(DragAndDropContext)
  const { setContextualInformationElement, setContextualInformationState } = useContext(ContextualInformationContext)
  const [isEdited, setIsEdited] = useState(false)

  const isSelected = useMemo(() => componentDelta >= 0 && hierarchyIds.length && hierarchyId && hierarchyIds[hierarchyIds.length - 1] === hierarchyId, [componentDelta, hierarchyIds, hierarchyId])
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyId), [componentDelta, componentRootHierarchyIds, hierarchyId])
  const isComponentRootFirstChild = useMemo(() => componentRootHierarchyIds.indexOf(hierarchyId) === 0, [componentRootHierarchyIds, hierarchyId])
  const isComponentRootLastChild = useMemo(() => componentRootHierarchyIds.indexOf(hierarchyId) === componentRootHierarchyIds.length - 1, [componentRootHierarchyIds, hierarchyId])

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
    canDrag: !isEdited,
  }), [setDragAndDrop, isEdited])

  const [{ canDrop, isOverCurrent }, drop] = useDrop(() => ({
    accept: 'Node',
    drop: (_item, monitor) => {
      if (monitor.didDrop()) return

      return {
        hierarchyIds: getHierarchyIds(rootRef.current as HTMLElement),
      }
    },
    collect: monitor => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    canDrop: () => !isEdited,
  }), [isEdited])

  const ref = useForkedRef(rootRef, useForkedRef(drag, drop)) as Ref<T>

  const handleClick = useCallback((event: MouseEvent) => {
    if (event.detail < 2) return // Double click or more only
    if (isEdited) return

    event.stopPropagation()

    const ids = getHierarchyIds(event.target)

    if (areArraysEqual(hierarchyIds, ids) || (areArraysEqualAtStart(hierarchyIds, ids) && componentDelta < 0)) {
      if (canBeEdited && componentDelta === 0 && isHierarchyOnComponent(hierarchy, componentAddress)) {
        setIsEdited(true)

        return
      }

      setEditionSearchParams({
        componentDelta: Math.min(0, componentDelta + 1),
      })

      return
    }

    // If the clicked element belongs to a component root, we need to adjust the component delta +1
    const shouldIncreaseComponentDelta = !!(hierarchyIds.length && componentRootHierarchyIds.includes(hierarchyIds[hierarchyIds.length - 1]) && componentRootHierarchyIds.includes(hierarchyId)) || belongsToComponentRoot(hierarchy, componentRootHierarchyIds, hierarchyId)

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
      componentDelta: shouldIncreaseComponentDelta ? Math.min(0, componentDelta + 1) : componentDelta,
    })

    setShouldAdjustComponentDelta(!shouldIncreaseComponentDelta)
  }, [
    isEdited,
    canBeEdited,
    hierarchyId,
    hierarchyIds,
    hierarchy,
    componentRootHierarchyIds,
    componentAddress,
    componentDelta,
    setEditionSearchParams,
    setShouldAdjustComponentDelta,
  ])

  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (!(isSelected || isComponentRoot)) return

    event.persist()
    event.preventDefault()
    event.stopPropagation()

    setContextualInformationState(x => ({ ...x, rightClickEvent: event }))
  }, [isSelected, isComponentRoot, setContextualInformationState])

  const generateClassName = useCallback(() => {
    let klassName = className

    if (isComponentRoot) {
      klassName += ' ecu-selected-root'

      if (isComponentRootFirstChild) {
        klassName += ' ecu-selected-root-first'
      }

      if (isComponentRootLastChild) {
        klassName += ' ecu-selected-root-last'
      }
    }

    if (isSelected) {
      klassName += ' ecu-selected'
    }

    if (isDragging) {
      klassName += ' ecu-drag'
    }

    if (canDrop && isOverCurrent) {
      klassName += ' ecu-drop'
    }

    if (isEdited) {
      klassName += ' ecu-edited'
    }

    return klassName.trim()
  }, [
    className,
    isComponentRoot,
    isComponentRootFirstChild,
    isComponentRootLastChild,
    isSelected,
    isDragging,
    canDrop,
    isOverCurrent,
    isEdited,
  ])

  useEffect(() => {
    if (!rootRef.current) return

    if (isSelected || (isComponentRoot && isComponentRootFirstChild)) {
      setContextualInformationElement(rootRef.current)
      setContextualInformationState(x => ({ ...x, isEdited, isComponentRoot: isComponentRootFirstChild }))
    }
  }, [
    isSelected,
    isComponentRoot,
    isComponentRootFirstChild,
    isEdited,
    setContextualInformationElement,
    setContextualInformationState,
  ])

  return {
    ref,
    hierarchyId,
    isEdited,
    setIsEdited,
    editionProps: {
      onClick: handleClick,
      onContextMenu: handleContextMenu,
      className: generateClassName(),
      'data-ecu': ecuId,
      'data-ecu-hierarchy': hierarchyId,
    },
  }
}

export default useEditionProps
