import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Div } from 'honorable'

import Overlay from './Overlay'

function Layout() {
  return (
    <Div
      xflex="y2s"
      overflowY="hidden"
      width="100vw"
      height="100vh"
    >
      <Overlay />
      <Div
        xflex="y2s"
        overflowY="auto"
        p={0.5}
      >
        <Outlet />
      </Div>
    </Div>
  )
}

export default memo(Layout)
