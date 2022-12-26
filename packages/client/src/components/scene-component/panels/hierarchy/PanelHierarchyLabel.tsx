import { MouseEvent, memo, useCallback, useContext, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Div } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'
import { SlTrash } from 'react-icons/sl'

import { HierarchyType } from '~types'

import { hierarchyTypeToColor } from '~constants'

import HierarchyContext from '~contexts/HierarchyContext'

import compareCursors from '~utils/compareCursors'

type DragCollectedProp = {
  isDragging: boolean
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
  const rootRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)

  const { setHierarchy } = useContext(HierarchyContext)

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

  const handleMove = useCallback((dragHierarchy: HierarchyType, hoverHierarchy: HierarchyType) => {
    console.log('dragHierarchy.cursors', dragHierarchy.cursors)
    console.log('hoverHierarchy.cursors', hoverHierarchy.cursors)

    setHierarchy(hierarchy => {
      if (!hierarchy) return hierarchy

      const nextHierarchy = { ...hierarchy }
      let parentHierarchy = nextHierarchy

      dragHierarchy.cursors.slice(0, -1).forEach(cursor => {
        parentHierarchy.children = [...parentHierarchy.children]

        parentHierarchy = parentHierarchy.children[cursor]
      })

      parentHierarchy.children = [...parentHierarchy.children]
      parentHierarchy.children.splice(dragHierarchy.cursors[dragHierarchy.cursors.length - 1], 1)

      parentHierarchy = nextHierarchy

      hoverHierarchy.cursors.slice(0, -1).forEach(cursor => {
        parentHierarchy.children = [...parentHierarchy.children]

        parentHierarchy = parentHierarchy.children[cursor]
      })

      parentHierarchy.children = [...parentHierarchy.children]
      parentHierarchy.children.splice(hoverHierarchy.cursors[hoverHierarchy.cursors.length - 1], 0, dragHierarchy)

      return nextHierarchy
    })
  }, [setHierarchy])

  const [{ isDragging }, drag] = useDrag<HierarchyType, void, DragCollectedProp>(() => ({
    type: 'Node',
    item: () => {
      onSelect()

      console.log('item')

      return hierarchy
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [hierarchy, onSelect])

  const [, drop] = useDrop<HierarchyType, void, void>(() => ({
    accept: 'Node',
    hover: (item, monitor) => {
      if (!rootRef.current) return

      // Don't replace items with themselves
      if (item.id === hierarchy.id) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = rootRef.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      if (!clientOffset) return

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      const cursorsComparison = compareCursors(item.cursors, hierarchy.cursors)

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downward, only move when the cursor is below 50%
      // When dragging upward, only move when the cursor is above 50%

      // Dragging downward
      if (cursorsComparison === -1 && hoverClientY < hoverMiddleY) return

      // Dragging upward
      if (cursorsComparison === 1 && hoverClientY > hoverMiddleY) return

      // Time to actually perform the action
      handleMove(item, hierarchy)
    },
  }), [hierarchy, handleMove])

  drag(drop(nameRef))

  return (
    <Div
      ref={rootRef}
      xflex="x4"
      opacity={isDragging ? 0 : 1}
      minWidth={0} // For ellipsis to work
      color={hierarchyTypeToColor[hierarchy.type] ?? 'text'}
      fontWeight={active ? 'bold' : undefined}
      userSelect="none"
      onClick={handleClick}
      gap={0.5}
      pr={1}
      _hover={{
        '> #PanelHierarchyLabel-delete': {
          visibility: isDragging ? 'hidden' : 'visible',
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
      <Div
        ref={nameRef}
        ellipsis
      >
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
