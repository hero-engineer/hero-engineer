import { PropsWithChildren, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'

type WithEcuHomeButtonProps = PropsWithChildren<any>

function WithEcuHomeButton({ children }: WithEcuHomeButtonProps) {
  const [displayed, setDisplayed] = useState(true)

  return (
    <>
      {displayed && (
        <Button
          position="fixed"
          top={16}
          right={16}
          as={Link}
          to="/__ecu__/components"
        >
          Ecu
        </Button>
      )}
      {children}
    </>
  )
}

export default WithEcuHomeButton
