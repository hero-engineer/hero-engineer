import '../css/edition.css'

import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useDebounce } from 'honorable'

import HierarchyContext from '../contexts/HierarchyContext'
import EditionContext from '../contexts/EditionContext'
import ContextualInformationContext from '../contexts/ContextualInformationContext'
import CssClassesContext from '../contexts/CssClassesContext'
import IsInteractiveModeContext from '../contexts/IsInteractiveModeContext'

import getComponentRootHierarchyIds from '../utils/getComponentRootHierarchyIds'

// import convertUnicode from '../utils/convertUnicode'

import useHierarchyId from './useHierarchyId'
import useEditionOverlay from './useEditionOverlay'

// type DragObject = {
//   hierarchyId: string
// }

// type DropResult = {
//   hierarchyId: string
//   dropElement: HTMLElement | null
// }

// type DragCollectedProp = {
//   isDragging: boolean
// }

// type DropCollectedProps = {
//   canDrop: boolean
//   isOverCurrent: boolean
// }

// Return common edition props for lib components
function useEditionProps<T extends HTMLElement>(ecuId: string, className = '', canBeEdited = false) {
  const rootRef = useRef<T>(null)

  const hierarchyId = useHierarchyId(ecuId, rootRef)
  const { hierarchyId: editionHierarchyId, componentDelta, isEdited, setIsEdited } = useContext(EditionContext)
  const { hierarchy } = useContext(HierarchyContext)
  const { setContextualInformationState } = useContext(ContextualInformationContext)
  const { selectedClassName, className: updatedClassName, setClassName, style: updatedStyle } = useContext(CssClassesContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)

  useEditionOverlay(rootRef, hierarchyId)

  const isSelected = useMemo(() => hierarchyId === editionHierarchyId, [hierarchyId, editionHierarchyId])
  const debouncedIsSelected = useDebounce(isSelected, 3 * 16) // 3 frames at 60fps to wait for componentDelta to adjust if positive
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyId), [componentDelta, componentRootHierarchyIds, hierarchyId])
  const isComponentRootFirstChild = useMemo(() => componentRootHierarchyIds.indexOf(hierarchyId) === 0, [componentRootHierarchyIds, hierarchyId])

  // const [{ isDragging }, drag] = useDrag<DragObject, DropResult, DragCollectedProp>(() => ({
  //   type: 'Node',
  //   item: () => {
  //     setDragAndDrop({
  //       sourceHierarchyId: '',
  //       targetHierarchyId: '',
  //       sourceComponentDelta: 0,
  //       targetComponentDelta: 0,
  //     })
  //     setContextualInformationState(x => ({ ...x, dropElement: null }))

  //     return { hierarchyId }
  //   },
  //   end: (item, monitor) => {
  //     const dropResult = monitor.getDropResult<DropResult>()

  //     if (item && dropResult && dropResult.hierarchyId !== hierarchyId) {
  //       setDragAndDrop({
  //         sourceHierarchyId: item.hierarchyId,
  //         targetHierarchyId: dropResult.hierarchyId,
  //         sourceComponentDelta: componentDelta,
  //         targetComponentDelta: 0,
  //       })
  //       setContextualInformationState(x => ({ ...x, dropElement: dropResult.dropElement }))
  //     }
  //   },
  //   collect: monitor => ({
  //     isDragging: monitor.isDragging(),
  //     handlerId: monitor.getHandlerId(),
  //   }),
  //   canDrag: (debouncedIsSelected || isComponentRoot) && !isEdited,
  // }), [
  //   hierarchyId,
  //   componentDelta,
  //   debouncedIsSelected,
  //   isComponentRoot,
  //   isEdited,
  //   setDragAndDrop,
  //   setContextualInformationState,
  // ])

  // const [{ canDrop, isOverCurrent }, drop] = useDrop<DragObject, DropResult, DropCollectedProps>(() => ({
  //   accept: 'Node',
  //   drop: (_item, monitor) => {
  //     if (monitor.didDrop()) return

  //     const dropHierarchyIds = getHierarchyIds(rootRef.current as HTMLElement)

  //     return {
  //       hierarchyId: dropHierarchyIds[dropHierarchyIds.length - 1],
  //       dropElement: rootRef.current,
  //     }
  //   },
  //   collect: monitor => ({
  //     isOverCurrent: monitor.isOver({ shallow: true }),
  //     canDrop: monitor.canDrop(),
  //   }),
  //   canDrop: () => !isEdited,
  // }), [isEdited])

  // const ref = useForkedRef(rootRef, useForkedRef(drag, drop)) as Ref<T>

  const generateClassName = useCallback(() => {
    // let klassName = `ecu-edition-no-outline ${convertUnicode(debouncedIsSelected ? updatedClassName || className : className)}`
    let klassName = `${isInteractiveMode ? '' : 'ecu-edition'} ${debouncedIsSelected ? updatedClassName || className : className}`

    klassName = klassName.trim()

    if (canBeEdited) {
      klassName += ' ecu-can-be-edited'
    }

    return klassName
  }, [
    canBeEdited,
    className,
    isInteractiveMode,
    updatedClassName,
    debouncedIsSelected,
  ])

  useEffect(() => {
    if (!rootRef.current) return

    if (debouncedIsSelected || (isComponentRoot && isComponentRootFirstChild)) {
      setContextualInformationState(x => ({ ...x, isEdited, isComponentRoot: isComponentRootFirstChild, element: rootRef.current }))
    }
  }, [
    debouncedIsSelected,
    isComponentRoot,
    isComponentRootFirstChild,
    isEdited,
    setContextualInformationState,
  ])

  useEffect(() => {
    if (!debouncedIsSelected || isComponentRoot) return

    setClassName(className)
  }, [debouncedIsSelected, isComponentRoot, setClassName, className])

  return {
    ref: rootRef,
    hierarchyId,
    isSelected: debouncedIsSelected,
    isEdited: isSelected && isEdited,
    setIsEdited,
    editionProps: {
      className: generateClassName(),
      style: isSelected || className.includes(selectedClassName) ? updatedStyle : {},
      'data-ecu': ecuId,
      'data-ecu-hierarchy': hierarchyId,
    },
  }
}

export default useEditionProps
