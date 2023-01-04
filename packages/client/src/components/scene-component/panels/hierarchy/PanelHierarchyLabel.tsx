import { MouseEvent, memo, useCallback, useContext, useRef } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { Div } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'

import { HierarchyType, NodeDragItemType } from '~types'

import { hierarchyTypeToColor } from '~constants'

import ComponentDragContext from '~contexts/ComponentDragContext'

import useNodeDragHelpers from '~hooks/useNodeDragHelpers'

import compareCursors from '~utils/compareCursors'

type PanelHierarchyLabelPropsType = {
  hierarchy: HierarchyType
  active: boolean
  expanded: boolean
  onSelect: () => void
  onExpand: () => void
}

function PanelHierarchyLabel({ hierarchy, active, expanded, onSelect, onExpand }: PanelHierarchyLabelPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  const { dragged } = useContext(ComponentDragContext)

  const { handleNodeDragStart, handleNodeDrag, handleNodeDragEnd } = useNodeDragHelpers()

  const handleClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onSelect()
  }, [onSelect])

  const handleExpand = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onExpand()
  }, [onExpand])

  const [, drag, preview] = useDrag<NodeDragItemType, void, void>(() => ({
    type: 'Node',
    item: () => {
      onSelect()
      handleNodeDragStart(hierarchy)

      console.log('Node drag')

      return {
        cursors: [...hierarchy.cursors],
      }
    },
    end: handleNodeDragEnd,
  }), [hierarchy, onSelect, handleNodeDragStart, handleNodeDragEnd])

  const [, drop] = useDrop<NodeDragItemType, void, void>(() => ({
    accept: 'Node',
    hover: (item, monitor) => {
      if (!rootRef.current) return

      const cursorsComparison = compareCursors(item.cursors, hierarchy.cursors)

      // Don't replace items with themselves
      if (cursorsComparison === 0) return

      // Determine rectangle on screen
      const hoverBoundingRect = rootRef.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      if (!clientOffset) return

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downward, only move when the cursor is below 50%
      // When dragging upward, only move when the cursor is above 50%

      // Dragging downward
      if (cursorsComparison === -1 && hoverClientY < hoverMiddleY) return

      // Dragging upward
      if (cursorsComparison === 1 && hoverClientY > hoverMiddleY) return

      // Get vertical third boundaries
      const hoverThirdY1 = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3
      const hoverThirdY2 = (hoverBoundingRect.bottom - hoverBoundingRect.top) * 2 / 3
      const isWithinThird = hoverClientY >= hoverThirdY1 && hoverClientY <= hoverThirdY2

      // Will be modified by handleMove
      const hoverCursors = [...hierarchy.cursors]

      // Time to actually perform the action
      handleNodeDrag(item.cursors, hoverCursors, isWithinThird)

      item.cursors = hoverCursors
    },
  }), [hierarchy, handleNodeDrag])

  drag(drop(rootRef))

  const isDragged = !!dragged && dragged.type === 'hierarchy' && dragged.hierarchyId === hierarchy.id

  return (
    <>
      <Div
        ref={rootRef}
        xflex="x4"
        opacity={isDragged ? 0.5 : 1}
        minWidth={0} // For ellipsis to work
        color={hierarchyTypeToColor[hierarchy.type] ?? 'text'}
        fontWeight={active ? 'bold' : undefined}
        userSelect="none"
        userDrag="none"
        onClick={handleClick}
        gap={0.5}
        pr={1}
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
      </Div>
      <DragPreviewImage
        connect={preview}
        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      />
    </>
  )
}

export default memo(PanelHierarchyLabel)
