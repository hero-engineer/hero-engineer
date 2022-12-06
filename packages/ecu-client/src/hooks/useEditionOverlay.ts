import { RefObject, useContext, useEffect } from 'react'

import EditionOverlayContext from '@contexts/EditionOverlayContext'

function useEditionOverlay(elementRef: RefObject<HTMLElement>, hierarchyId: string) {
  const { setElementRegistry } = useContext(EditionOverlayContext)

  useEffect(() => {
    if (!elementRef?.current) return

    setElementRegistry(previousElementRegistry => ({ ...previousElementRegistry, [hierarchyId]: elementRef.current }))
  }, [elementRef, hierarchyId, setElementRegistry])
}

export default useEditionOverlay
