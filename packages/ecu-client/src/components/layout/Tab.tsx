import { MouseEvent, ReactNode, useCallback, useContext, useRef, useState } from 'react'
import { Div, useForkedRef } from 'honorable'
import { XYCoord, useDrag, useDrop } from 'react-dnd'
import { MdClose } from 'react-icons/md'

import { TabType } from '~types'

import { zIndexes } from '~constants'

import TabsContext from '~contexts/TabsContext'

type DragObject = {
  url: string
}

type DropResult = {
  url: string
  isLeftDropZone: boolean
}

type DragCollectedProp = {
  offset: XYCoord | null
}

type DropCollectedProps = {
  canDrop: boolean
  isOver: boolean
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
  const { setTabs } = useContext(TabsContext)
  const [isLeftDropZone, setIsLeftDropZone] = useState(false)

  const handleTabDrop = useCallback((dropUrl: string, isLeftDropZone: boolean) => {
    setTabs(tabs => {
      const nextTabs = [...tabs]

      nextTabs.splice(nextTabs.indexOf(tab), 1)
      nextTabs.splice(nextTabs.findIndex(t => t.url === dropUrl) + (isLeftDropZone ? 0 : 1), 0, tab)

      return nextTabs
    })
  }, [tab, setTabs])

  const [, drag] = useDrag<DragObject, DropResult, DragCollectedProp>(() => ({
    type: 'Tab',
    item: () => ({ url: tab.url }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult && dropResult.url !== tab.url) {
        handleTabDrop(dropResult.url, dropResult.isLeftDropZone)
      }
    },
  }), [tab.url, handleTabDrop])

  const [{ canDrop, isOver }, drop] = useDrop<DragObject, DropResult, DropCollectedProps>(() => ({
    accept: 'Tab',
    hover: (_item, monitor) => {
      const offset = monitor.getClientOffset()

      if (offset && rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect()
        const x = offset.x - rect.left

        setIsLeftDropZone(x < rect.width / 2)
      }
    },
    drop: (_item, monitor) => {
      if (monitor.didDrop()) return

      return {
        url: tab.url,
        isLeftDropZone,
      }
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }), [tab.url, isLeftDropZone])

  const forkedRef = useForkedRef(rootRef, useForkedRef(drag, drop))

  return (
    <Div
      ref={forkedRef}
      xflex="x4s"
      position="relative"
      width={128}
      maxWidth={128}
      backgroundColor={active ? 'background' : 'background-light'}
      borderRight="1px solid border"
      _hover={{
        backgroundColor: 'background',
        '> #Tab-close': {
          display: 'flex',
        },
      }}
      onClick={onClick}
      cursor="pointer"
      userSelect="none"
      pl={1}
      pr={0.25}
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
      {canDrop && isOver && (
        <Div
          position="absolute"
          top={0}
          bottom={0}
          left={isLeftDropZone ? -3 : null}
          right={isLeftDropZone ? null : -2}
          width={4}
          backgroundColor="primary"
          zndex={zIndexes.tabDropGhost}
        />
      )}
    </Div>
  )
}

export default Tab
