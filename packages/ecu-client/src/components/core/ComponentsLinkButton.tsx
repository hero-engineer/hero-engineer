import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'
import { CgComponents } from 'react-icons/cg'

function ComponentsLinkButton() {
  return (
    <Button
      ghost
      as={Link}
      to="/__ecu__/components"
    >
      <CgComponents />
    </Button>
  )
}

export default memo(ComponentsLinkButton)
