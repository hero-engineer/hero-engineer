import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { CgComponents } from 'react-icons/cg'

function ComponentsLinkButton(props: any) {
  return (
    <Tooltip
      label="Components"
      placement="bottom-start"
    >
      <Button
        ghost
        as={Link}
        to="/_ecu_/components"
        {...props}
      >
        <CgComponents />
      </Button>
    </Tooltip>
  )
}

export default memo(ComponentsLinkButton)
