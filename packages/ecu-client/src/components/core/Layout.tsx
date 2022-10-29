import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Div, H1 } from 'honorable'

import Overlay from './Overlay'

function Layout() {
  return (
    <Div p={1}>
      <Overlay />
      <H1>Ecu</H1>
      <Outlet />
    </Div>
  )
}

export default memo(Layout)
