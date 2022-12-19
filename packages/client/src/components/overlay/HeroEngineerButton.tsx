import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { GiRosaShield } from 'react-icons/gi'

// A button that links to the home scene
function HeroEngineerButton(props: any) {
  return (
    <Tooltip
      label="Hero Engineer home"
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

export default HeroEngineerButton