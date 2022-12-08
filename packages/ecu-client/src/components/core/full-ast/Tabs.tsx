import { MouseEvent, useCallback, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Div } from 'honorable'
import { MdClose } from 'react-icons/md'

import TabsContext from '~contexts/TabsContext'

const iconStyle = {
  fontSize: '0.75rem',
}

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
      navigate(nextTabs[index]?.url ?? nextTabs[index - 1]?.url ?? '/_ecu_')
    }
  }, [tabs, pathname, setTabs, navigate])

  return (
    <Div
      xflex="x4s"
      flexShrink={1}
      fontSize="0.85rem"
    >
      {tabs.map(({ url, label }) => (
        <Div
          key={url}
          xflex="x4s"
          backgroundColor={pathname === url ? 'background' : null}
          borderBottom={pathname === url ? null : '1px solid border'}
          borderRight="1px solid border"
          _hover={{ backgroundColor: pathname === url ? 'background' : 'background-light-dark' }}
          onClick={() => handleTabClick(url)}
          cursor="pointer"
          pl={1}
          pr={0.25}
        >
          <Div xflex="x4">
            {label}
          </Div>
          <Div
            xflex="x5"
            fontSize="0.75rem"
            onClick={event => handleTabClose(event, url)}
            pl={0.5}
            pr={0.25}
          >
            <MdClose style={iconStyle} />
          </Div>
        </Div>
      ))}
    </Div>
  )
}

export default Tabs
