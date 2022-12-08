import { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'

import TabsContext from '~contexts/TabsContext'

type TabLinkPropsType = {
  to: string
  label: string
  children: string
}

function TabLink({ to, label, children }: TabLinkPropsType) {
  const { setTabs } = useContext(TabsContext)

  const handleClick = useCallback(() => {
    setTabs(tabs => tabs.some(t => t.url === to) ? tabs : [...tabs, { url: to, label }])
  }, [to, label, setTabs])

  return (
    <Link
      to={to}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

export default TabLink
