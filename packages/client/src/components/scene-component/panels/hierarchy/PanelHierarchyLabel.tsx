import { MouseEvent, memo, useCallback, useContext, useRef } from 'react'
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import { Div } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'

import { HierarchyType } from '~types'

import { hierarchyTypeToColor } from '~constants'

import HierarchyContext from '~contexts/HierarchyContext'

import compareCursors from '~utils/compareCursors'

type DragItem = {
  cursors: number[]
}

type PanelHierarchyLabelPropsType = {
  hierarchy: HierarchyType
  active: boolean
  expanded: boolean
  dragged: boolean
  onSelect: () => void
  onExpand: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

function repairCursors(hierarchy: HierarchyType) {
  hierarchy.children.forEach((child, index) => {
    child.cursors = [...hierarchy.cursors, index]

    repairCursors(child)
  })
}

function PanelHierarchyLabel({ hierarchy, active, expanded, dragged, onSelect, onExpand, onDragStart, onDragEnd }: PanelHierarchyLabelPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  const { setHierarchy } = useContext(HierarchyContext)

  const handleClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onSelect()
  }, [onSelect])

  const handleExpand = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    onExpand()
  }, [onExpand])

  const handleMove = useCallback((dragCursors: number[], hoverCursors: number[]) => {
    console.log('dragHierarchy.cursors', dragCursors)
    console.log('hoverHierarchy.cursors', hoverCursors)

    setHierarchy(hierarchy => {
      if (!hierarchy) return hierarchy

      const nextHierarchy = { ...hierarchy }
      let parentHierarchy = nextHierarchy

      dragCursors.slice(1, -1).forEach(cursor => {
        parentHierarchy.children = [...parentHierarchy.children]

        parentHierarchy = parentHierarchy.children[cursor]
      })

      parentHierarchy.children = [...parentHierarchy.children]
      const [dragHierarchy] = parentHierarchy.children.splice(dragCursors[dragCursors.length - 1], 1)

      repairCursors(parentHierarchy)

      parentHierarchy = nextHierarchy
      // console.log('1 hoverHierarchy.cursors', hoverHierarchy.cursors)

      hoverCursors.slice(1, -1).forEach(cursor => {
        parentHierarchy.children = [...parentHierarchy.children]

        parentHierarchy = parentHierarchy.children[cursor]
      })

      parentHierarchy.children = [...parentHierarchy.children]
      parentHierarchy.children.splice(hoverCursors[hoverCursors.length - 1], 0, dragHierarchy)

      // console.log('2', parentHierarchy)

      repairCursors(parentHierarchy)

      return nextHierarchy
    })
  }, [setHierarchy])

  const [, drag, preview] = useDrag<DragItem, void, void>(() => ({
    type: 'Node',
    item: () => {
      onSelect()
      onDragStart()

      console.log('xxx', [...hierarchy.cursors])

      return {
        cursors: [...hierarchy.cursors],
      }
    },
    end: () => {
      onDragEnd()
    },
  }), [onSelect])

  const [, drop] = useDrop<DragItem, void, void>(() => ({
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

      const hoverCursors = [...hierarchy.cursors]

      // Time to actually perform the action
      handleMove(item.cursors, hoverCursors)

      item.cursors = hoverCursors
      // console.log('item.cursors', item.cursors)
      // item.cursors[item.cursors.length - 1] -= cursorsComparison
      // console.log('item.cursors', item.cursors[item.cursors.length - 1])
    },
  }), [hierarchy, handleMove])

  drag(drop(rootRef))

  return (
    <>
      <Div
        ref={rootRef}
        xflex="x4"
        opacity={dragged ? 0.5 : 1}
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
