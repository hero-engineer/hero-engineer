import { useCallback, useContext } from 'react'

import { HierarchyType } from '~types'

import HierarchyContext from '~contexts/HierarchyContext'
import ComponentDragContext from '~contexts/ComponentDragContext'

function repairCursors(hierarchy: HierarchyType) {
  hierarchy.children.forEach((child, index) => {
    child.cursors = [...hierarchy.cursors, index]

    repairCursors(child)
  })
}

function useNodeDragHelpers() {
  const { setHierarchy } = useContext(HierarchyContext)
  const { setDragged } = useContext(ComponentDragContext)

  const handleNodeDragStart = useCallback((hierarchy: HierarchyType) => {
    setDragged({ type: 'hierarchy', hierarchyId: hierarchy.id })
  }, [setDragged])

  const handleNodeDrag = useCallback((dragCursors: number[], hoverCursors: number[], isWithin: boolean) => {
    console.log(dragCursors, hoverCursors)

    setHierarchy(hierarchy => {
      if (!hierarchy) return hierarchy

      const nextHierarchy = { ...hierarchy }
      let parentHierarchy = nextHierarchy

      dragCursors.slice(1, -1).forEach(cursor => {
        parentHierarchy.children = [...parentHierarchy.children]

        parentHierarchy = parentHierarchy.children[cursor]
      })

      parentHierarchy.children = [...parentHierarchy.children]
      const [dragHierarchy] = parentHierarchy.children.splice(dragCursors[dragCursors.length - 1], 1)

      repairCursors(parentHierarchy)

      parentHierarchy = nextHierarchy

      hoverCursors.slice(1, isWithin ? hoverCursors.length - 1 : -1).forEach(cursor => {
        parentHierarchy.children = [...parentHierarchy.children]

        parentHierarchy = parentHierarchy.children[cursor]
      })

      parentHierarchy.children = [...parentHierarchy.children]
      parentHierarchy.children.splice(hoverCursors[hoverCursors.length - 1], 0, dragHierarchy)

      repairCursors(parentHierarchy)

      return nextHierarchy
    })
  }, [setHierarchy])

  const handleNodeDragEnd = useCallback(() => {
    setDragged(null)
  }, [setDragged])

  return {
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragEnd,
  }
}

export default useNodeDragHelpers
