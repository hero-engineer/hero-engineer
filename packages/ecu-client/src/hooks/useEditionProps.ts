import '../css/edition.css'

import { MouseEvent, Ref, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDrag, useDrop } from 'react-dnd'

import HierarchyContext from '../contexts/HierarchyContext'
import DragAndDropContext from '../contexts/DragAndDropContext'
import ContextualInformationContext from '../contexts/ContextualInformationContext'
import CssClassesContext from '../contexts/CssClassesContext'

import getComponentRootHierarchyIds from '../helpers/getComponentRootHierarchyIds'
import isHierarchyOnComponent from '../helpers/isHierarchyOnComponent'

import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import areArraysEqual from '../utils/areArraysEqual'

import useForkedRef from './useForkedRef'
import useHierarchyId from './useHierarchyId'
import useEditionSearchParams from './useEditionSearchParams'

type DragObject = {
  hierarchyId: string
}

type DropResult = {
  hierarchyId: string
  dropElement: HTMLElement | null
}

type DragCollectedProp = {
  isDragging: boolean
}

type DropCollectedProps = {
  canDrop: boolean
  isOverCurrent: boolean
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

// Return common edition props for lib components
function useEditionProps<T extends HTMLElement>(ecuId: string, className = '', canBeEdited = false) {
  const { componentAddress = '' } = useParams()
  const rootRef = useRef<T>(null)
  const hierarchyId = useHierarchyId(ecuId, rootRef)
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)
  const { dragAndDrop, setDragAndDrop } = useContext(DragAndDropContext)
  const { setContextualInformationState } = useContext(ContextualInformationContext)
  const { setClassName, updatedClassName } = useContext(CssClassesContext)
  const [isEdited, setIsEdited] = useState(false)

  const isSelected = useMemo(() => componentDelta >= 0 && hierarchyIds.length > 0 && !!hierarchyId && hierarchyIds[hierarchyIds.length - 1] === hierarchyId, [componentDelta, hierarchyIds, hierarchyId])
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyId), [componentDelta, componentRootHierarchyIds, hierarchyId])
  const isComponentRootFirstChild = useMemo(() => componentRootHierarchyIds.indexOf(hierarchyId) === 0, [componentRootHierarchyIds, hierarchyId])
  const isComponentRootLastChild = useMemo(() => componentRootHierarchyIds.indexOf(hierarchyId) === componentRootHierarchyIds.length - 1, [componentRootHierarchyIds, hierarchyId])
  const isDrop = useMemo(() => hierarchyId && dragAndDrop.targetHierarchyId === hierarchyId, [dragAndDrop.targetHierarchyId, hierarchyId])

  const [{ isDragging }, drag] = useDrag<DragObject, DropResult, DragCollectedProp>(() => ({
    type: 'Node',
    item: () => {
      setDragAndDrop({
        sourceHierarchyId: '',
        targetHierarchyId: '',
        sourceComponentDelta: 0,
        targetComponentDelta: 0,
      })
      setContextualInformationState(x => ({ ...x, dropElement: null }))

      return { hierarchyId }
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult && dropResult.hierarchyId !== hierarchyId) {
        setDragAndDrop({
          sourceHierarchyId: item.hierarchyId,
          targetHierarchyId: dropResult.hierarchyId,
          sourceComponentDelta: componentDelta,
          targetComponentDelta: 0,
        })
        setContextualInformationState(x => ({ ...x, dropElement: dropResult.dropElement }))
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    canDrag: (isSelected || isComponentRoot) && !isEdited,
  }), [
    hierarchyId,
    componentDelta,
    isSelected,
    isComponentRoot,
    isEdited,
    setDragAndDrop,
    setContextualInformationState,
  ])

  const [{ canDrop, isOverCurrent }, drop] = useDrop<DragObject, DropResult, DropCollectedProps>(() => ({
    accept: 'Node',
    drop: (_item, monitor) => {
      if (monitor.didDrop()) return

      const dropHierarchyIds = getHierarchyIds(rootRef.current as HTMLElement)

      return {
        hierarchyId: dropHierarchyIds[dropHierarchyIds.length - 1],
        dropElement: rootRef.current,
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
    if (isEdited) return

    // Reset dragAndDrop
    setDragAndDrop({
      sourceHierarchyId: '',
      targetHierarchyId: '',
      sourceComponentDelta: 0,
      targetComponentDelta: 0,
    })

    event.stopPropagation()

    const ids = getHierarchyIds(event.target)

    if (!ids.length) return

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
      // componentDelta > 0 means adjustment is necessary (see HierarchyBar)
      componentDelta: 1,
    })
  }, [
    isEdited,
    setDragAndDrop,
    hierarchyIds,
    componentDelta,
    canBeEdited,
    hierarchy,
    componentAddress,
    setEditionSearchParams,
  ])

  const handleContextMenu = useCallback((event: MouseEvent) => {
    if (!(isSelected || isComponentRoot)) return

    event.persist()
    event.preventDefault()
    event.stopPropagation()

    setContextualInformationState(x => ({ ...x, rightClickEvent: event }))
  }, [isSelected, isComponentRoot, setContextualInformationState])

  const generateClassName = useCallback(() => {
    let klassName = `ecu-edition-no-outline ${isSelected && updatedClassName !== null ? updatedClassName : className}`

    klassName = klassName.trim()

    if (canBeEdited) {
      klassName += ' ecu-can-be-edited'
    }

    if (componentDelta > 0) return klassName.trim()

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

    if (canDrop && isOverCurrent || isDrop) {
      klassName += ' ecu-drop'
    }

    if (isEdited) {
      klassName += ' ecu-edited'
    }

    return klassName.trim()
  }, [
    updatedClassName,
    className,
    componentDelta,
    canBeEdited,
    canDrop,
    isSelected,
    isEdited,
    isComponentRoot,
    isComponentRootFirstChild,
    isComponentRootLastChild,
    isDragging,
    isOverCurrent,
    isDrop,
  ])

  useEffect(() => {
    if (!rootRef.current) return

    if (isSelected || (isComponentRoot && isComponentRootFirstChild)) {
      setContextualInformationState(x => ({ ...x, isEdited, isComponentRoot: isComponentRootFirstChild, element: rootRef.current }))
    }
  }, [
    isSelected,
    isComponentRoot,
    isComponentRootFirstChild,
    isEdited,
    setContextualInformationState,
  ])

  useEffect(() => {
    if (!isSelected || isComponentRoot) return

    setClassName(className)
  }, [isSelected, isComponentRoot, setClassName, className])

  return {
    ref,
    hierarchyId,
    isSelected,
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
