import { useCallback, useContext } from 'react'
import { Div, P, TreeView } from 'honorable'

import HierarchyContext from '../../contexts/HierarchyContext'
import { HierarchyItemType } from '../../types'

function HierarchySection() {
  const { totalHierarchy } = useContext(HierarchyContext)

  const renderHierarchyItemLabel = useCallback((hierarchyItem: HierarchyItemType) => (
    <Div
      xflex="x4"
      py={0.25}
      cursor="pointer"
      userSelect="none"
    >
      {hierarchyItem.label}
    </Div>
  ), [])

  const renderHierarchyItem = useCallback((hierarchyItem: HierarchyItemType | null) => {
    if (!(hierarchyItem && hierarchyItem.label)) return null

    return (
      <TreeView
        defaultExpanded
        label={renderHierarchyItemLabel(hierarchyItem)}
        key={hierarchyItem.label}
      >
        {hierarchyItem.children.map(renderHierarchyItem)}
      </TreeView>
    )
  }, [renderHierarchyItemLabel])

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256 + 64}
      px={1}
    >
      <P
        fontWeight="bold"
        userSelect="none"
        mt={0.5}
        mb={0.5}
      >
        Hierarchy
      </P>
      {renderHierarchyItem(totalHierarchy)}
    </Div>
  )
}

export default HierarchySection
