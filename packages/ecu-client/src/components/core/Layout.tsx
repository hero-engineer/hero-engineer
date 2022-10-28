import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import Overlay from './Overlay'

function Layout() {
  return (
    <div>
      <Overlay />
      <h1>Ecu</h1>
      <Outlet />
    </div>
  )
}

export default memo(Layout)
