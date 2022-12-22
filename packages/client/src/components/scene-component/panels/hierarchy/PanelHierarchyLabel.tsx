import { MouseEvent, memo, useCallback, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
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
  const rootRef = useRef<HTMLDivElement>(null)

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
      ref={rootRef}
      xflex="x4"
      minWidth={0} // For ellipsis to work
      color={hierarchyTypeToColor[hierarchy.type] ?? 'text'}
      fontWeight={active ? 'bold' : undefined}
      userSelect="none"
      onClick={handleClick}
      gap={0.5}
      pr={1}
      _hover={{
        '> #PanelHierarchyLabel-delete': {
          visibility: 'visible',
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
          ml="-6px"
          mr={-0.5}
          pr={0.25}
        >
          <BiCaretRight />
        </Div>
      )}
      <Div ellipsis>
        {hierarchy.name}
      </Div>
      <Div
        id="PanelHierarchyLabel-delete"
        xflex="x5"
        flexShrink={0}
        fontSize="0.75rem"
        color="danger"
        visibility="hidden"
        onClick={handleDelete}
        px={0.5}
      >
        <SlTrash />
      </Div>
    </Div>
  )
}

export default memo(PanelHierarchyLabel)
