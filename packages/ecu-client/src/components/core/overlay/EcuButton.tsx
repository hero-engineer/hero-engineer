import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { GiRosaShield } from 'react-icons/gi'

// A button that links to the home scene
function EcuButton(props: any) {
  return (
    <Tooltip
      label="Ecu home"
      placement="bottom-start"
    >
      <Button
        ghost
        as={Link}
        to="/_ecu_"
        {...props}
      >
        <GiRosaShield />
      </Button>
    </Tooltip>
  )
}

export default EcuButton
