import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { MdOutlineExitToApp } from 'react-icons/md'

// A button that links to the working application
function ViewAppButton(props: any) {
  return (
    <Tooltip
      label="View app"
      placement="bottom"
    >
      <Button
        ghost
        as={Link}
        to="/"
        {...props}
      >
        <MdOutlineExitToApp />
      </Button>
    </Tooltip>
  )
}

export default ViewAppButton
