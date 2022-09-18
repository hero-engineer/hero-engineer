import { Link, Outlet } from 'react-router-dom'
import { Div, Flex } from 'honorable'

function Layout() {
  return (
    <>
      <Flex>
        <Link to="">Home</Link>
        <Link to="scenes">Scenes</Link>
        <Link to="components">Components</Link>
        <Link to="semantic-tokens">Semantic Tokens</Link>
        <Div flexGrow={1} />
        <Link to="/">Back to app</Link>
      </Flex>
      <Outlet />
    </>
  )
}

export default Layout
