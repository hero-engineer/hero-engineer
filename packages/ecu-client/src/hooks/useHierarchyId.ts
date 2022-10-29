import { RefObject, useCallback, useContext, useEffect, useState } from 'react'

import HotContext from '../contexts/HotContext'

function getHierarchyId(targetElement: HTMLElement, targetId: string) {
  const hierarchyIdsRegistry: Record<string, number> = {}

  let currentElement = targetElement

  while (currentElement) {
    const id = currentElement.getAttribute('data-ecu')

    if (!id) break

    currentElement = currentElement.parentElement as HTMLElement
  }

  function traverse(element: HTMLElement) {
    const id = element.getAttribute('data-ecu')

    if (id) {
      if (typeof hierarchyIdsRegistry[id] === 'undefined') hierarchyIdsRegistry[id] = 0
      else hierarchyIdsRegistry[id]++
    }

    if (element === targetElement) return true

    for (const child of element.children) {
      const found = traverse(child as HTMLElement)

      if (found) return true
    }

    return false
  }

  const found = traverse(currentElement)

  return found ? `${targetId}:${hierarchyIdsRegistry[targetId]}` : targetId
}

function useHierarchyId<T>(id: string, ref: RefObject<T>) {
  const hot = useContext(HotContext)
  const [hierarchyId, setHierarchyId] = useState('')

  const updateHierarchyId = useCallback(() => {
    if (!ref?.current) return

    setHierarchyId(getHierarchyId(ref.current as any as HTMLElement, id))
  }, [id, ref])

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
