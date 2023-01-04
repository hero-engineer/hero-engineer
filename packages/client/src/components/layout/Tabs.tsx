import { MouseEvent, useCallback, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Div } from 'honorable'

import TabsContext from '~contexts/TabsContext'

import Tab from '~components/layout/Tab'

function Tabs() {
  const { tabs, setTabs } = useContext(TabsContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleTabClick = useCallback((url: string) => {
    navigate(url)
  }, [navigate])

  const handleTabClose = useCallback((event: MouseEvent, url: string) => {
    event.stopPropagation()

    const nextTabs = [...tabs]
    const index = tabs.findIndex(x => x.url === url)

    nextTabs.splice(index, 1)

    setTabs(nextTabs)

    if (pathname === url) {
      navigate(nextTabs[index]?.url ?? nextTabs[index - 1]?.url ?? '/_hero_')
    }
  }, [tabs, pathname, setTabs, navigate])

  return (
    <Div
      xflex="x4s"
      flexGrow
      flexShrink={1}
      fontSize="0.85rem"
    >
      {tabs.map(tab => (
        <Tab
          key={tab.url}
          tab={tab}
          active={pathname === tab.url}
          onClick={() => handleTabClick(tab.url)}
          onClose={event => handleTabClose(event, tab.url)}
        />
      ))}
    </Div>
  )
}

export default Tabs
