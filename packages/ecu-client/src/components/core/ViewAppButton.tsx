import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'
import { MdOutlineExitToApp } from 'react-icons/md'

function ViewAppButton() {
  return (
    <Button
      ghost
      as={Link}
      to="/"
    >
      <MdOutlineExitToApp />
    </Button>
  )
}

export default memo(ViewAppButton)
