import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Div } from 'honorable'

import Overlay from './Overlay'

function Layout() {
  return (
    <Div
      xflex="y2s"
      overflowY="auto"
      width="100vw"
      height="100vh"
      position="relative"
    >
      <Overlay />
      <Div
        xflex="y2s"
        overflowY="auto"
        flexGrow={1}
        flexShrink={0}
        p={0.5}
      >
        <Outlet />
      </Div>
    </Div>
  )
}

export default memo(Layout)
