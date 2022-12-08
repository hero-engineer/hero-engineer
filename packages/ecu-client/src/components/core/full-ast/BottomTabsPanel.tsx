import { Dispatch, MouseEvent, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { Accordion, Div } from 'honorable'
import { IoCodeSlashOutline } from 'react-icons/io5'

import { zIndexes } from '~constants'

import BottomTabsContext from '~contexts/BottomTabsContext'

import usePersistedState from '~hooks/usePersistedState'
import usePreviousWithDefault from '~hooks/usePreviousWithDefault'

import Tab from '~core/full-ast/Tab'

const minHeight = 64

function BottomTabsPanel() {
  const [isExpanded, setIsExpanded] = usePersistedState('bottom-tabs-panel-expanded', false)
  const [height, setHeight] = usePersistedState('bottom-tabs-panel-height', 256)

  const { tabs, setTabs, currentTabIndex, setCurrentTabIndex } = useContext(BottomTabsContext)
  const previousTabs = usePreviousWithDefault(tabs, tabs)

  const handleTabClick = useCallback((event: MouseEvent, index: number) => {
    event.stopPropagation()

    setCurrentTabIndex(index)
  }, [setCurrentTabIndex])

  const handleTabClose = useCallback((event: MouseEvent, index: number) => {
    event.stopPropagation()

    const nextTabs = [...tabs]

    nextTabs.splice(index, 1)

    setTabs(nextTabs)
    setCurrentTabIndex(nextTabs[index] ? index : nextTabs[index - 1] ? index - 1 : -1)
  }, [tabs, setTabs, setCurrentTabIndex])

  const renderTabs = useCallback(() => (
    <Div
      xflex="x4s"
      flexGrow
      height={32}
    >
      {tabs.map(({ url, label }, i) => (
        <Tab
          key={url}
          active={i === currentTabIndex}
          label={label}
          icon={<IoCodeSlashOutline />}
          onClick={(event: MouseEvent) => handleTabClick(event, i)}
          onClose={(event: MouseEvent) => handleTabClose(event, i)}
        />
      ))}
      <Div
        flexGrow
        borderBottom="1px solid border"
      />
    </Div>
  ), [tabs, currentTabIndex, handleTabClick, handleTabClose])

  useEffect(() => {
    if (tabs.length <= previousTabs.length) return

    setIsExpanded(true)
  }, [tabs, previousTabs, setIsExpanded])

  if (!tabs.length) return null

  return (
    <>
      {isExpanded && <BottomTabsPanelHandle setHeight={setHeight} />}
      <Accordion
        bottomTabs
        invertExpandIcon
        flexShrink={0}
        expanded={isExpanded}
        onExpand={setIsExpanded}
        title={renderTabs()}
        width="100%"
        borderTop="1px solid border"
      >
        <Div
          height={height}
          maxHeight={height}
          overflow="auto"
        >
          Foo
        </Div>
      </Accordion>
    </>
  )
}

type BottomTabsPanelHandlePropsType = {
  setHeight: Dispatch<SetStateAction<number>>
}

function BottomTabsPanelHandle({ setHeight }: BottomTabsPanelHandlePropsType) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setHeight(height => Math.min(window.innerHeight - 64, Math.max(minHeight, height - event.movementY)))
  }, [setHeight])

  useEffect(() => {
    if (!isDragging) return

    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseUp])

  return (
    <>
      <Div
        flexShrink={0}
        width="100%"
        height={5}
        backgroundColor={isDragging ? 'primary' : undefined}
        _hover={{ backgroundColor: 'primary' }}
        userSelect="none"
        cursor="row-resize"
        onMouseDown={handleMouseDown}
      />
      {isDragging && (
        <Div
          position="fixed"
          left={0}
          right={0}
          top={0}
          bottom={0}
          onMouseMove={handleMouseMove}
          zIndex={zIndexes.bottomTabsPanelHandle}
          cursor="row-resize"
        />
      )}
    </>
  )
}

export default BottomTabsPanel
