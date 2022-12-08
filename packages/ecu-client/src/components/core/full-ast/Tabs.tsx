import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Div } from 'honorable'

import TabsContext from '~contexts/TabsContext'

const linkStyle = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
}

function Tabs() {
  const { tabs } = useContext(TabsContext)
  const { pathname } = useLocation()

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
            xflex="x4"
            px={1}
            backgroundColor={pathname === url ? 'background' : null}
            borderBottom={pathname === url ? null : '1px solid border'}
            borderRight="1px solid border"
            _hover={{ backgroundColor: pathname === url ? 'background' : 'background-light-dark' }}
          >
            {label}
          </Div>
        </Link>
      ))}
    </Div>
  )
}

export default Tabs
