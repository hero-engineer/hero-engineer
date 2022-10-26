import { MouseEvent, useCallback, useContext } from 'react'

import EditionContext from '../contexts/EditionContext'

const selectionStyles = {
  outline: '1px solid lightblue',
}

function getHierarchyIds(element: EventTarget) {
  const hierarchyIds = []

  let currentElement = element as HTMLElement | null

  while (currentElement) {
    const id = currentElement.getAttribute('data-ecu')

    if (!id) break

    hierarchyIds.push(id)
    currentElement = currentElement.parentElement
  }

  return hierarchyIds.reverse()
}

function useEditionProps(id: string) {
  const { hierarchyIds, setHierarchyIds } = useContext(EditionContext)

  const handleClick = useCallback((event: MouseEvent) => {
    if (event.detail < 2) return // Double click or more only

    event.stopPropagation()

    const ids = getHierarchyIds(event.target)

    setHierarchyIds(x => {
      const nextIds = []

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]

        nextIds.push(id)

        if (x[i] !== id) {
          break
        }
      }

      // console.log('nextIds', nextIds)

      return nextIds
    })
  }, [setHierarchyIds])

  return {
    onClick: handleClick,
    style: {
      userSelect: 'none' as any,
      ...(hierarchyIds[hierarchyIds.length - 1] === id ? selectionStyles : {}),
    },
  }
}

export default useEditionProps
