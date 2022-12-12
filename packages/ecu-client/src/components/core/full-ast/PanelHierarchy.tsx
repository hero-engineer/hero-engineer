import { MouseEvent, memo, useCallback, useContext, useState } from 'react'
import { Div, P, TreeView } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'

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
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const renderHierarchy = useCallback((hierarchy: HierarchyType, isRoot = false) => {
    if (hierarchy.element?.nodeType === Node.TEXT_NODE) return null

    return (
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
        barColor={typeToColor[hierarchy.type] ?? 'text'}
        width="100%"
        mt={isRoot ? -0.5 : 0}
      >
        {hierarchy.children.map(child => renderHierarchy(child))}
      </TreeView>
    )
  }, [collapsed, currentHierarchyId, setCurrentHierarchyId])

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

type PanelHierarchyLabelPropsType = {
  hierarchy: HierarchyType
  active: boolean
  expanded: boolean
  onSelect: () => void
  onExpand: () => void
}

function PanelHierarchyLabel({ hierarchy, active, expanded, onSelect, onExpand }: PanelHierarchyLabelPropsType) {

  const handleClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onSelect()
  }, [onSelect])

  const handleExpand = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onExpand()
  }, [onExpand])

  return (
    <Div
      xflex="x4"
      color={typeToColor[hierarchy.type] ?? 'text'}
      fontWeight={active ? 'bold' : undefined}
      userSelect="none"
      onClick={handleClick}
    >
      {!!hierarchy.children.filter(h => h.element?.nodeType !== Node.TEXT_NODE).length && (
        <Div
          xflex="x5"
          transform={expanded ? 'rotate(90deg)' : undefined}
          onClick={handleExpand}
          mr={0.25}
          ml="-6px"
        >
          <BiCaretRight />
        </Div>
      )}
      {hierarchy.name}
    </Div>
  )
}

export default memo(PanelHierarchy)
