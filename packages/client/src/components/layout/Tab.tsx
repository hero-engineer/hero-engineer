import { MouseEvent, ReactNode, useCallback, useContext, useRef } from 'react'
import { Div } from 'honorable'
import { useDrag, useDrop } from 'react-dnd'
import { MdClose } from 'react-icons/md'

import { TabType } from '~types'

import TabsContext from '~contexts/TabsContext'

type DragObject = {
  url: string
}

type DragCollectedProp = {
  isDragging: boolean
}

type TabPropsType = {
  tab: TabType
  active: boolean
  icon?: ReactNode
  onClick: (event: MouseEvent) => void
  onClose: (event: MouseEvent) => void
}

function Tab({ tab, active, icon, onClick, onClose }: TabPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { tabs, setTabs } = useContext(TabsContext)

  const handleTabMove = useCallback((dragIndex: number, hoverIndex: number) => {
    setTabs(tabs => {
      const nextTabs = [...tabs]
      const [tab] = nextTabs.splice(dragIndex, 1)

      nextTabs.splice(hoverIndex, 0, tab)

      return nextTabs
    })
  }, [setTabs])

  const [{ isDragging }, drag] = useDrag<DragObject, void, DragCollectedProp>(() => ({
    type: 'Tab',
    item: () => ({ url: tab.url }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [tab.url])

  const [, drop] = useDrop<DragObject, void, void>(() => ({
    accept: 'Tab',
    hover: (item, monitor) => {
      if (!rootRef.current) return

      const dragUrl = item.url
      const hoverUrl = tab.url

      // Don't replace items with themselves
      if (dragUrl === hoverUrl) {
        return
      }

      const dragIndex = tabs.findIndex(t => t.url === dragUrl)
      const hoverIndex = tabs.findIndex(t => t.url === hoverUrl)

      // Determine rectangle on screen
      const hoverBoundingRect = rootRef.current?.getBoundingClientRect()

      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      if (!clientOffset) return

      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging rightward, only move when the cursor is below 50%
      // When dragging leftward, only move when the cursor is above 50%

      // Dragging rightward
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return

      // Dragging leftward
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      // Time to actually perform the action
      handleTabMove(dragIndex, hoverIndex)
    },
  }), [tab.url, tabs, handleTabMove])

  drag(drop(rootRef))

  return (
    <Div
      ref={rootRef}
      xflex="x4s"
      position="relative"
      width={128}
      maxWidth={128}
      backgroundColor={active ? 'background' : 'background-light'}
      opacity={isDragging ? 0 : 1}
      borderRight="1px solid border"
      cursor="pointer"
      userSelect="none"
      onClick={onClick}
      pl={1}
      pr={0.25}
      _hover={{
        backgroundColor: active ? 'background' : 'background-light-dark',
        '> #Tab-close': {
          display: 'flex',
        },
      }}
    >
      {!!icon && (
        <Div
          xflex="x5"
          flexShrink={0}
          color="text-light"
          ml={-0.5}
          pr={0.5}
        >
          {icon}
        </Div>
      )}
      <Div
        xflex="x4"
        flexGrow
        flexShrink={1}
        minWidth={0} // For ellipsis to work
      >
        <Div ellipsis>
          {tab.label}
        </Div>
      </Div>
      <Div
        id="Tab-close"
        xflex="x5"
        flexShrink={0}
        display="none"
        fontSize="0.75rem"
        onClick={onClose}
        pl={0.5}
        pr={0.25}
      >
        <MdClose />
      </Div>
    </Div>
  )
}

export default Tab
