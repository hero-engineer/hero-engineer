import { MouseEvent, memo, useCallback, useContext } from 'react'
import { Div, P, TreeView } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'
import { SlTrash } from 'react-icons/sl'

import { HierarchyType } from '~types'

import deleteNode from '~processors/typescript/deleteNode'

import HierarchyContext from '~contexts/HierarchyContext'
import LogsContext from '~contexts/LogsContext'

import usePersistedState from '~hooks/usePersistedState'

const typeToColor = {
  component: 'hierarchy-type-component',
  element: 'hierarchy-type-element',
  children: 'hierarchy-type-children',
  array: 'hierarchy-type-array',
  text: 'hierarchy-type-text',
}

// The hierarchy section
// Displayed in the left panel
function PanelHierarchy() {
  const { logs } = useContext(LogsContext)
  const { hierarchy, currentHierarchyId, setCurrentHierarchyId } = useContext(HierarchyContext)
  const [collapsed, setCollapsed] = usePersistedState<Record<string, boolean>>('panel-hierarchy-collapsed', {})

  const handleDelete = useCallback(async (hierarchy: HierarchyType) => {
    await deleteNode(hierarchy, logs.hierarchy)
  }, [logs.hierarchy])

  const renderHierarchy = useCallback((hierarchy: HierarchyType, isRoot = false) => {
    if (hierarchy.type === 'text') return null

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
            onDelete={() => handleDelete(hierarchy)}
          />
        )}
        barColor={typeToColor[hierarchy.type] ?? 'text'}
        width="100%"
        mt={isRoot ? -0.5 : 0}
      >
        {hierarchy.children.map(child => renderHierarchy(child))}
      </TreeView>
    )
  }, [collapsed, currentHierarchyId, setCollapsed, setCurrentHierarchyId, handleDelete])

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
  onDelete: () => void
}

function PanelHierarchyLabel({ hierarchy, active, expanded, onSelect, onExpand, onDelete }: PanelHierarchyLabelPropsType) {

  const handleClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onSelect()
  }, [onSelect])

  const handleExpand = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onExpand()
  }, [onExpand])

  const handleDelete = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onDelete()
  }, [onDelete])

  return (
    <Div
      xflex="x4"
      minWidth={0} // For ellipsis to work
      color={typeToColor[hierarchy.type] ?? 'text'}
      fontWeight={active ? 'bold' : undefined}
      userSelect="none"
      onClick={handleClick}
      _hover={{
        '> #PanelHierarchyLabel-delete': {
          display: 'flex',
        },
      }}
    >
      {!!hierarchy.children.filter(h => h.type !== 'text').length && (
        <Div
          xflex="x5"
          flexShrink={0}
          transform={expanded ? 'rotate(90deg)' : undefined}
          transformOrigin="45% 45%"
          onClick={handleExpand}
          pr={0.25}
          ml="-6px"
        >
          <BiCaretRight />
        </Div>
      )}
      <Div
        flexGrow
        ellipsis
      >
        {hierarchy.name}
      </Div>
      {hierarchy.start !== -1 && (
        <Div
          id="PanelHierarchyLabel-delete"
          xflex="x5"
          flexShrink={0}
          display="none"
          fontSize="0.75rem"
          color="danger"
          onClick={handleDelete}
          px={0.5}
        >
          <SlTrash />
        </Div>
      )}
    </Div>
  )
}

export default memo(PanelHierarchy)
