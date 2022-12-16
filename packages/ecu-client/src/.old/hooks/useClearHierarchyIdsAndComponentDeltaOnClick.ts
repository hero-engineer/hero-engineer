import { RefObject, useCallback, useContext, useEffect } from 'react'

import HierarchyContext from '~contexts/HierarchyContext2'

// Reset currentHierarchyId on outside of component double click
function useClearHierarchyIdsAndComponentDeltaOnClick(clickRef: RefObject<HTMLElement>) {
  const { setCurrentHierarchyId } = useContext(HierarchyContext)

  const handleClick = useCallback((event: MouseEvent) => {
    if (!clickRef.current) return

    if (event.target !== clickRef.current) return

    setCurrentHierarchyId('')
  }, [
    clickRef,
    setCurrentHierarchyId,
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
