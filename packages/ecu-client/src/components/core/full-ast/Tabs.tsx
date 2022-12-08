import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Div } from 'honorable'

import TabsContext from '~contexts/TabsContext'

function Tabs() {
  const { tabs } = useContext(TabsContext)

  return (
    <Div
      xflex="x4s"
      flexGrow
      flexShrink={1}
    >
      {tabs.map(({ url, label }) => (
        <Link
          key={url}
          to={url}
        >
          <Div px={1}>
            {label}
          </Div>
        </Link>
      ))}
    </Div>
  )
}

export default Tabs
