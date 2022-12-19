import { RefObject, useCallback, useContext, useEffect, useState } from 'react'

import HotContext from '~contexts/HotContext'

function getHierarchyId(targetElement: HTMLElement, targetHeroEngineerId: string) {
  const hierarchyIdsRegistry: Record<string, number> = {}

  let currentElement = targetElement

  while (currentElement) {
    const ecuId = currentElement.getAttribute('data-hero-engineer')

    if (!ecuId) break

    currentElement = currentElement.parentElement as HTMLElement
  }

  function traverse(element: HTMLElement) {
    const ecuId = element.getAttribute('data-hero-engineer')

    if (ecuId) {
      if (typeof hierarchyIdsRegistry[ecuId] === 'undefined') hierarchyIdsRegistry[ecuId] = 0
      else hierarchyIdsRegistry[ecuId]++
    }

    if (element === targetElement) return true

    for (const child of element.children) {
      const found = traverse(child as HTMLElement)

      if (found) return true
    }

    return false
  }

  const found = traverse(currentElement)

  return found ? `${targetHeroEngineerId}:${hierarchyIdsRegistry[targetHeroEngineerId]}` : targetHeroEngineerId
}

// Return a hierarchyId from an ecuId
function useHierarchyId<T>(ecuId: string, ref: RefObject<T>) {
  const hot = useContext(HotContext)
  const [hierarchyId, setHierarchyId] = useState('')

  const updateHierarchyId = useCallback(() => {
    if (!ref?.current) return

    setHierarchyId(getHierarchyId(ref.current as any as HTMLElement, ecuId))
  }, [ecuId, ref])

  useEffect(() => {
    updateHierarchyId()
  }, [updateHierarchyId])

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        updateHierarchyId()
      })
    }
  }, [hot, updateHierarchyId])

  return hierarchyId
}

export default useHierarchyId
