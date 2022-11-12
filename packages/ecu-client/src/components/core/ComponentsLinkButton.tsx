import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { CgComponents } from 'react-icons/cg'

function ComponentsLinkButton(props: any) {
  return (
    <Tooltip
      label="Components"
      placement="bottom"
    >
      <Button
        ghost
        as={Link}
        to="/__ecu__/components"
        {...props}
      >
        <CgComponents />
      </Button>
    </Tooltip>
  )
}

export default memo(ComponentsLinkButton)
