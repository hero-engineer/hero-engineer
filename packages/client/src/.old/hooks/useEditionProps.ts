import { CSSProperties, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import { cssValueReset } from '~constants'

import HierarchyContext from '~contexts/HierarchyContext'
import EditionContext from '~contexts/EditionContext'
import ContextualInformationContext from '~contexts/ContextualInformationContext'
import CssClassesContext from '~contexts/CssClassesContext'
import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'

import getComponentRootHierarchyIds from '~utils/getComponentRootHierarchyIds'

import useEditionOverlay from './useEditionOverlay'
import useHierarchyId from './useHierarchyId'

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

function removeResetStyles(style: CSSProperties) {
  const nextStyles = { ...style }

  Object.keys(nextStyles).forEach(key => {
    // @ts-expect-error
    if (nextStyles[key] === cssValueReset) delete nextStyles[key] // ... This is not ok
  })

  return nextStyles
}

// Return common edition props for lib components
function useEditionProps<T extends HTMLElement>(ecuId: string, className = '') {
  const rootRef = useRef<T>(null)

  const hierarchyId = useHierarchyId(ecuId, rootRef)
  const { hierarchyId: editionHierarchyId, componentDelta, isEdited, setIsEdited } = useContext(EditionContext)
  const { hierarchy } = useContext(HierarchyContext)
  const { setContextualInformationState } = useContext(ContextualInformationContext)
  const { selectedClassName, className: updatedClassName, style: updatedStyle } = useContext(CssClassesContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)

  useEditionOverlay(rootRef, hierarchyId)

  const isSelected = useMemo(() => hierarchyId === editionHierarchyId, [hierarchyId, editionHierarchyId])
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
  //   canDrag: (isSelected || isComponentRoot) && !isEdited,
  // }), [
  //   hierarchyId,
  //   componentDelta,
  //   isSelected,
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

  const generateClassName = useCallback(
    () => `${isInteractiveMode ? '' : 'hero-engineer-edition'} ${isSelected ? updatedClassName || className : className}`.trim(),
    [
      className,
      isInteractiveMode,
      updatedClassName,
      isSelected,
    ]
  )

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

  return {
    ref: rootRef,
    hierarchyId,
    isSelected,
    isEdited: isSelected && isEdited,
    setIsEdited,
    editionProps: {
      className: generateClassName(),
      style: isSelected || className.includes(selectedClassName) ? removeResetStyles(updatedStyle) : {},
      'data-hero-engineer': ecuId,
      'data-hero-engineer-hierarchy': hierarchyId,
    },
  }
}

export default useEditionProps
