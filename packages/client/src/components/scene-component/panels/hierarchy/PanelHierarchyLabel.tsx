import { MouseEvent, memo, useCallback } from 'react'
import { Div } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'
import { SlTrash } from 'react-icons/sl'

import { HierarchyType } from '~types'

import { hierarchyTypeToColor } from '~constants'

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
      color={hierarchyTypeToColor[hierarchy.type] ?? 'text'}
      fontWeight={active ? 'bold' : undefined}
      userSelect="none"
      onClick={handleClick}
      _hover={{
        '> #PanelHierarchyLabel-delete': {
          display: 'flex',
        },
      }}
    >
      {!!hierarchy.children.length && (
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

export default memo(PanelHierarchyLabel)
