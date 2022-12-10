import { MouseEvent, ReactNode, useCallback, useRef } from 'react'
import { Div, useForkedRef } from 'honorable'
import { MdClose } from 'react-icons/md'
import { XYCoord, useDrag, useDrop } from 'react-dnd'

import { TabType } from '~types'

type DragObject = {
  url: string
}

type DropResult = {
  url: string
}

type DragCollectedProp = {
  offset: XYCoord | null
}

type DropCollectedProps = unknown

type TabPropsType = {
  tab: TabType
  active: boolean
  icon?: ReactNode
  onClick: (event: MouseEvent) => void
  onClose: (event: MouseEvent) => void
}

function Tab({ tab, active, icon, onClick, onClose }: TabPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  const handleTabDrop = useCallback((dropUrl: string) => {
    console.log('url', dropUrl)
  }, [])

  const [, drag] = useDrag<DragObject, DropResult, DragCollectedProp>(() => ({
    type: 'Tab',
    item: () => ({ url: tab.url }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()

      if (item && dropResult && dropResult.url !== tab.url) {
        handleTabDrop(dropResult.url)
      }
    },
  }), [tab.url, handleTabDrop])

  const [, drop] = useDrop<DragObject, DropResult, DropCollectedProps>(() => ({
    accept: 'Tab',
    hover: (_item, monitor) => {
      const offset = monitor.getClientOffset()

      if (offset && rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect()
        const x = offset.x - rect.left

        console.log(x)
      }
      else {
        console.log('---')
      }
    },
    drop: (_item, monitor) => {
      if (monitor.didDrop()) return

      return {
        url: tab.url,
      }
    },
    collect: () => ({}),
  }), [tab.url])

  const forkedRef = useForkedRef(rootRef, useForkedRef(drag, drop))

  return (
    <Div
      ref={forkedRef}
      xflex="x4s"
      width={128}
      maxWidth={128}
      backgroundColor={active ? 'background' : null}
      borderBottom={`1px solid ${active ? 'transparent' : 'border'}`}
      borderRight="1px solid border"
      _hover={{
        backgroundColor: active ? 'background' : 'background-light-dark',
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
    </Div>
  )
}

export default Tab
