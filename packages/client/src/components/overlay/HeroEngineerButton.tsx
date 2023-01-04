import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { GiSwordsEmblem } from 'react-icons/gi'

// A button that links to the home scene
function HeroEngineerButton(props: any) {
  return (
    <Tooltip
      label="Hero Engineer home"
      placement="bottom"
    >
      <Button
        ghost
        as={Link}
        to="/_hero_"
        {...props}
      >
        <GiSwordsEmblem />
      </Button>
    </Tooltip>
  )
}

export default HeroEngineerButton
