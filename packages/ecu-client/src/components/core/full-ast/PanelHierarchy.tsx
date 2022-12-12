import { memo, useCallback, useContext, useState } from 'react'
import { Div, P, TreeView } from 'honorable'

import { HierarchyType } from '~types'

import HierarchyContext from '~contexts/HierarchyContext2'

const typeToColor = {
  component: 'type-component',
  element: 'type-element',
  children: 'type-children',
  array: 'type-array',
}

// The hierarchy section
// Displayed in the left panel
function PanelHierarchy() {
  const { hierarchy } = useContext(HierarchyContext)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const renderHierarchy = useCallback((hierarchy: HierarchyType) => {
    if (hierarchy.element?.nodeType === Node.TEXT_NODE) return null

    return (
      <TreeView
        key={hierarchy.id}
        expanded={!collapsed[hierarchy.id]}
        onExpand={expanded => setCollapsed(x => ({ ...x, [hierarchy.id]: !expanded }))}
        label={(
          <PanelHierarchyLabel hierarchy={hierarchy} />
        )}
        barColor={typeToColor[hierarchy.type] ?? 'text'}
        width="100%"
      >
        {hierarchy.children.map(renderHierarchy)}
      </TreeView>
    )
  }, [collapsed, setCollapsed])

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
          ...
        </Div>
      )}
    </Div>
  )
}

type PanelHierarchyLabelPropsType = {
  hierarchy: HierarchyType
}

function PanelHierarchyLabel({ hierarchy }: PanelHierarchyLabelPropsType) {
  return (
    <Div
      color={typeToColor[hierarchy.type] ?? 'text'}
      userSelect="none"
    >
      {hierarchy.name}
    </Div>
  )
}

export default memo(PanelHierarchy)
