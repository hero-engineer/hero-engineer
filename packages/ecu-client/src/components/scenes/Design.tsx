import { Div } from 'honorable'
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align'
import { Link, Outlet } from 'react-router-dom'

const linkStyle = {
  textDecoration: 'none',
}

const tabProps = {
  xflex: 'x4',
  py: 1,
  px: 2,
  borderBottom: '1px solid border',
  textDecoration: 'none',
  fontWeight: 'bold',
  color: 'text-light',
  _hover: {
    backgroundColor: 'background-light',
  },
}

// Design scene
function Design() {
  return (
    <Div
      flexGrow
      xflex="x4s"
      gap={2}
    >
      <Div
        xflex="y2s"
        flexShrink={0}
        width={128 + 32 + 8 + 2}
      >
        <Link
          to="/_ecu_/design/system"
          style={linkStyle}
        >
          <Div
            {...tabProps}
            borderTop="1px solid border"
          >
            Design System
          </Div>
        </Link>
        <Link
          to="/_ecu_/design/root-css"
          style={linkStyle}
        >
          <Div {...tabProps}>
            Root CSS
          </Div>
        </Link>
      </Div>
      <Div
        xflex="y2s"
        flexGrow
        overflowY="auto"
      >
        <Outlet />
      </Div>
    </Div>
  )
}

export default Design
