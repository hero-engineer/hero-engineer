import { Accordion, Div } from 'honorable'
import { MouseEvent, useCallback, useContext } from 'react'

import BottomTabsContext from '~contexts/BottomTabsContext'

import usePersistedState from '~hooks/usePersistedState'

import Tab from '~core/full-ast/Tab'

function BottomTabsPanel() {
  const [isExpanded, setIsExpanded] = usePersistedState('bottom-tabs-panel-expanded', false)

  const { tabs, setTabs } = useContext(BottomTabsContext)

  const handleTabClick = useCallback(() => {

  }, [])

  const handleTabClose = useCallback((event: MouseEvent) => {

  }, [])

  const renderTabs = useCallback(() => (
    <Div
      xflex="x4s"
      flexGrow
      height={32}
    >
      {tabs.map(({ url, label }) => (
        <Tab
          key={url}
          active
          label={label}
          onClick={handleTabClick}
          onClose={handleTabClose}
        />
      ))}
    </Div>
  ), [tabs, handleTabClick, handleTabClose])

  return (
    <Accordion
      bottomTabs
      expanded={isExpanded}
      onExpand={setIsExpanded}
      title={renderTabs()}
      width="100%"
      borderTop="1px solid border"
    >
      Foo
    </Accordion>
  )
}

export default BottomTabsPanel
