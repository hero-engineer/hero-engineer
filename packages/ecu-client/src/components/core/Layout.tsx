import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Div, H1 } from 'honorable'

import Overlay from './Overlay'

function Layout() {
  return (
    <Div
      xflex="y2s"
      overflowY="auto"
      width="100vw"
      height="100vh"
      p={1}
    >
      <H1>
        Ecu
      </H1>
      <Overlay />
      <Outlet />
    </Div>
  )
}

export default memo(Layout)
