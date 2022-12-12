import { memo, useCallback, useContext, useState } from 'react'
import { Div, P, TreeView } from 'honorable'

import { HierarchyType } from '~types'

import HierarchyContext from '~contexts/HierarchyContext2'

// The hierarchy section
// Displayed in the left panel
function PanelHierarchy() {
  const { hierarchy } = useContext(HierarchyContext)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const renderHierarchy = useCallback((hierarchy: HierarchyType) => (
    <TreeView
      key={hierarchy.id}
      width="100%"
      defaultExpanded
      label={hierarchy.name}
      expanded={!collapsed[hierarchy.id]}
    >
      {hierarchy.children.map(renderHierarchy)}
    </TreeView>
  ), [collapsed])

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256 - 1} // Minus 1 to align with the top bar
      overflowY="auto"
    >
      <P
        fontWeight="bold"
        userSelect="none"
        px={1}
        mt={0.5}
        mb={0.5}
      >
        Hierarchy
      </P>
      {hierarchy && (
        <Div
          flexGrow
          overflowY="auto"
          pb={2}
          pl={1}
        >
          {renderHierarchy(hierarchy)}
        </Div>
      )}
      {!hierarchy && (
        <Div pl={1}>
          No hierarchy
        </Div>
      )}
    </Div>
  )
}

export default memo(PanelHierarchy)
