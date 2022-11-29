import { RefObject, useCallback, useContext, useEffect } from 'react'

import EditionContext from '../contexts/EditionContext'
import DragAndDropContext from '../contexts/DragAndDropContext'

// Reset hierarchyIds and componentDelta on outside of component double click
function useClearHierarchyIdsAndComponentDeltaOnClick(clickRef: RefObject<HTMLElement>) {
  const { setHierarchyId, setComponentDelta, setIsEdited } = useContext(EditionContext)
  const { setDragAndDrop } = useContext(DragAndDropContext)

  const handleClick = useCallback((event: MouseEvent) => {
    if (!clickRef.current) return

    if (event.target !== clickRef.current) return

    setHierarchyId('')
    setComponentDelta(0)
    setIsEdited(false)
    setDragAndDrop({
      sourceHierarchyId: '',
      targetHierarchyId: '',
      sourceComponentDelta: 0,
      targetComponentDelta: 0,
    })
  }, [
    clickRef,
    setHierarchyId,
    setComponentDelta,
    setIsEdited,
    setDragAndDrop,
  ])

  useEffect(() => {
    if (!clickRef.current) return

    const clickElement = clickRef.current

    clickElement.addEventListener('click', handleClick)

    return () => {
      clickElement.removeEventListener('click', handleClick)
    }
  }, [clickRef, handleClick])
}

export default useClearHierarchyIdsAndComponentDeltaOnClick
