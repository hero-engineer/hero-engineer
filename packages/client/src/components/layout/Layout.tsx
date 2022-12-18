import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Div } from 'honorable'

import Overlay from '~components/overlay/Overlay'

// The Ecu layout
function Layout() {
  return (
    <Div
      xflex="y2s"
      overflowY="auto"
      width="100vw"
      height="100vh"
      maxHeight="100vh"
      position="relative"
      onContextMenu={e => e.preventDefault()}
    >
      <Overlay>
        <Outlet />
      </Overlay>
    </Div>
  )
}

export default memo(Layout)
