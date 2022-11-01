import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'
import { MdOutlineExitToApp } from 'react-icons/md'

function ViewAppButton(props: any) {
  return (
    <Button
      ghost
      as={Link}
      to="/"
      {...props}
    >
      <MdOutlineExitToApp />
    </Button>
  )
}

export default memo(ViewAppButton)
