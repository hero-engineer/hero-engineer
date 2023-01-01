import { memo, useCallback, useContext } from 'react'
import { Div, P, TreeView } from 'honorable'

import { HierarchyType } from '~types'

import { hierarchyTypeToColor } from '~constants'

// import deleteNode from '~processors/typescript/deleteNode'

import HierarchyContext from '~contexts/HierarchyContext'
// import LogsContext from '~contexts/LogsContext'

import usePersistedState from '~hooks/usePersistedState'

import PanelHierarchyLabel from '~components/scene-component/panels/hierarchy/PanelHierarchyLabel'

// The hierarchy section
// Displayed in the left panel
function PanelHierarchy() {
  // const { logs } = useContext(LogsContext)
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)
  const [collapsed, setCollapsed] = usePersistedState<Record<string, boolean>>('panel-hierarchy-collapsed', {})

  // const handleDelete = useCallback(async (hierarchy: HierarchyType) => {
  //   await deleteNode(hierarchy, logs.typescript)
  // }, [logs.typescript])

  const renderHierarchy = useCallback((hierarchy: HierarchyType, isRoot = false) => (
    <TreeView
      key={hierarchy.id}
      expanded={!collapsed[hierarchy.id]}
      label={(
        <PanelHierarchyLabel
          hierarchy={hierarchy}
          active={currentHierarchyId === hierarchy.id}
          expanded={!collapsed[hierarchy.id]}
          onSelect={() => setCurrentHierarchyId(hierarchy.id)}
          onExpand={() => setCollapsed(x => ({ ...x, [hierarchy.id]: !collapsed[hierarchy.id] }))}
        />
      )}
      barColor={hierarchyTypeToColor[hierarchy.type] ?? 'text'}
      width="100%"
      mt={isRoot ? -0.5 : 0}
    >
      {hierarchy.children.map(child => renderHierarchy(child))}
    </TreeView>
  ), [collapsed, currentHierarchyId, setCollapsed, setCurrentHierarchyId])

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
        my={0.5}
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
          {renderHierarchy(hierarchy, true)}
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

export default memo(PanelHierarchy)
