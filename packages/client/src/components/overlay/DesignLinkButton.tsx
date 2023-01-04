import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { MdOutlineWorkspaces } from 'react-icons/md'

// A button that links to the components scene
function DesignLinkButton(props: any) {
  return (
    <Tooltip
      label="Design"
      placement="bottom"
    >
      <Button
        ghost
        as={Link}
        to="/_hero_/design"
        {...props}
      >
        <MdOutlineWorkspaces />
      </Button>
    </Tooltip>
  )
}

export default DesignLinkButton
