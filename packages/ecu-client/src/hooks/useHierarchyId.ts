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
    console.log('traverse', element)
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

  console.log('currentElement', currentElement)

  const found = traverse(currentElement)

  console.log('hierarchyIdsRegistry', hierarchyIdsRegistry)

  return found ? `${targetId}:${hierarchyIdsRegistry[targetId]}` : targetId
}

function useHierarchyId<T>(id: string, ref: RefObject<T>) {
  const hot = useContext(HotContext)
  const [hierarchyId, setHierarchyId] = useState('')

  const updateHierarchyId = useCallback(() => {
    if (!ref?.current) return

    console.log('ref.current', ref.current)

    setHierarchyId(getHierarchyId(ref.current as any as HTMLElement, id))
  }, [id, ref])

  useEffect(() => {
    updateHierarchyId()
  }, [updateHierarchyId])

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        console.log('updating registry')
        updateHierarchyId()
      })
    }
  }, [hot, updateHierarchyId])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  return hierarchyId
}

export default useHierarchyId
