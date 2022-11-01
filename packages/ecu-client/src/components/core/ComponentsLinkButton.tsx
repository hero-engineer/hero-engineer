import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'
import { CgComponents } from 'react-icons/cg'

function ComponentsLinkButton(props: any) {
  return (
    <Button
      ghost
      as={Link}
      to="/__ecu__/components"
      {...props}
    >
      <CgComponents />
    </Button>
  )
}

export default memo(ComponentsLinkButton)
