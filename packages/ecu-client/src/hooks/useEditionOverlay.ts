import { RefObject, useContext, useEffect } from 'react'

import EditionOverlayContext from '../contexts/EditionOverlayContext'

function useEditionOverlay(elementRef: RefObject<HTMLElement>, hierarchyId: string) {
  const { setElementRegistry } = useContext(EditionOverlayContext)

  useEffect(() => {
    if (!elementRef?.current) return

    setElementRegistry(previousElementRegistry => {
      const nextElementRegistry = [...previousElementRegistry]

      const foundIndex = nextElementRegistry.findIndex(x => x.hierarchyId === hierarchyId)

      if (foundIndex !== -1) {
        nextElementRegistry.splice(foundIndex, 1)
      }

      nextElementRegistry.push({
        hierarchyId,
        element: elementRef.current,
      })

      return nextElementRegistry
    })
  }, [elementRef, hierarchyId, setElementRegistry])
}

export default useEditionOverlay
