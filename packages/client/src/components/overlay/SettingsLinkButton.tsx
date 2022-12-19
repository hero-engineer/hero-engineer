import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { SlSettings } from 'react-icons/sl'

// A button that links to the settings scene
function SettingsLinkButton(props: any) {
  return (
    <Tooltip
      label="Settings"
      placement="bottom-end"
    >
      <Button
        ghost
        as={Link}
        to="/_hero_/settings"
        {...props}
      >
        <SlSettings />
      </Button>
    </Tooltip>
  )
}

export default SettingsLinkButton
