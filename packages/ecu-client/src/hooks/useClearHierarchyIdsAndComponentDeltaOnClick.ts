import { RefObject, useCallback, useContext, useEffect } from 'react'

import DragAndDropContext from '../contexts/DragAndDropContext'

import useEditionSearchParams from './useEditionSearchParams'

// Reset hierarchyIds and componentDelta on outside of component double click
function useClearHierarchyIdsAndComponentDeltaOnClick(clickRef: RefObject<HTMLElement>) {
  const { setDragAndDrop } = useContext(DragAndDropContext)

  const { setEditionSearchParams } = useEditionSearchParams()

  const handleClick = useCallback((event: MouseEvent) => {
    if (!clickRef.current) return

    if (event.target === clickRef.current) {
      setEditionSearchParams({
        hierarchyIds: [],
        componentDelta: 0,
      })
      setDragAndDrop({
        sourceHierarchyId: '',
        targetHierarchyId: '',
        sourceComponentDelta: 0,
        targetComponentDelta: 0,
      })
    }
  }, [clickRef, setEditionSearchParams, setDragAndDrop])

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
