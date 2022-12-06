import { MouseEvent, useCallback, useContext } from 'react'

import { HierarchyItemType } from '@types'

import HierarchyContext from '@contexts/HierarchyContext'
import EditionContext from '@contexts/EditionContext'
import EditionOverlayContext from '@contexts/EditionOverlayContext'
import CssClassesContext from '@contexts/CssClassesContext'

function useHierarchySelection() {
  const { totalHierarchy } = useContext(HierarchyContext)
  const { hierarchyId, setHierarchyId, componentDelta, setComponentDelta, setIsEdited } = useContext(EditionContext)
  const { elementRegistry } = useContext(EditionOverlayContext)
  const { setClassName, setSelectedClassName, setStyle } = useContext(CssClassesContext)

  const handleHierarchySelect = useCallback((event: MouseEvent, hierarchyItem: HierarchyItemType, nextHierarchyId: string, nextComponentDelta: number) => {
    if (nextHierarchyId === hierarchyId && nextComponentDelta === componentDelta) {
      if (event.detail > 1 && hierarchyItem.isComponentEditable) {
        if (hierarchyItem.onComponentAddress === totalHierarchy?.componentAddress) {
          event.stopPropagation()

          setIsEdited(true)

          return true
        }

        return false
      }
    }
    else {
      const element = elementRegistry[hierarchyItem.hierarchyId ?? ''] ?? null
      const classNames = element?.getAttribute('class')?.split(' ').map(x => x.trim()).filter(x => !x.startsWith('ecu-')) ?? []

      setHierarchyId(nextHierarchyId)
      setComponentDelta(nextComponentDelta)
      setIsEdited(false)
      setStyle({})
      setClassName(classNames.join(' '))
      setSelectedClassName(x => classNames.includes(x) ? x : '')

      return true
    }
  }, [
    hierarchyId,
    componentDelta,
    totalHierarchy,
    elementRegistry,
    setHierarchyId,
    setComponentDelta,
    setIsEdited,
    setStyle,
    setClassName,
    setSelectedClassName,
  ])

  return handleHierarchySelect
}

export default useHierarchySelection
