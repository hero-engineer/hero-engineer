import { memo } from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <h1>Ecu</h1>
      <Outlet />
    </div>
  )
}

export default memo(Layout)
