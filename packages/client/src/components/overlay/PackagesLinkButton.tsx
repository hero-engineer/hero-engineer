import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { VscPackage } from 'react-icons/vsc'

// A button that links to the packages scene
function PackagesLinkButton(props: any) {
  return (
    <Tooltip
      label="Packages"
      placement="bottom"
    >
      <Button
        ghost
        as={Link}
        to="/_hero_/packages"
        {...props}
      >
        <VscPackage />
      </Button>
    </Tooltip>
  )
}

export default PackagesLinkButton
