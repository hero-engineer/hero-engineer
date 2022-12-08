import { useCallback, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Div } from 'honorable'
import { MdClose } from 'react-icons/md'

import TabsContext from '~contexts/TabsContext'

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
}

const iconStyle = {
  fontSize: '0.75rem',
}

function Tabs() {
  const { tabs, setTabs } = useContext(TabsContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleTabClose = useCallback((url: string) => {
    const index = tabs.findIndex(x => x.url === url)
    const nextTabs = tabs.splice(index, 1)

    setTabs(nextTabs)
    navigate(nextTabs[index]?.url ?? nextTabs[index - 1]?.url ?? '/_ecu_')
  }, [tabs, setTabs, navigate])

  return (
    <Div
      xflex="x4s"
      flexShrink={1}
      fontSize="0.85rem"
    >
      {tabs.map(({ url, label }) => (
        <Link
          key={url}
          to={url}
          style={linkStyle}
        >
          <Div
            xflex="x4s"
            backgroundColor={pathname === url ? 'background' : null}
            borderBottom={pathname === url ? null : '1px solid border'}
            borderRight="1px solid border"
            _hover={{ backgroundColor: pathname === url ? 'background' : 'background-light-dark' }}
            pl={1}
            pr={0.25}
          >
            <Div xflex="x4">
              {label}
            </Div>
            <Div
              xflex="x5"
              fontSize="0.75rem"
              onClick={() => handleTabClose(url)}
              pl={0.5}
              pr={0.25}
            >
              <MdClose style={iconStyle} />
            </Div>
          </Div>
        </Link>
      ))}
    </Div>
  )
}

export default Tabs
