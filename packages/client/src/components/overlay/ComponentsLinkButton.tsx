import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { CgComponents } from 'react-icons/cg'

// A button that links to the components scene
function ComponentsLinkButton(props: any) {
  return (
    <Tooltip
      label="Components"
      placement="bottom-start"
    >
      <Button
        ghost
        as={Link}
        to="/_hero_/components"
        {...props}
      >
        <CgComponents />
      </Button>
    </Tooltip>
  )
}

export default ComponentsLinkButton
