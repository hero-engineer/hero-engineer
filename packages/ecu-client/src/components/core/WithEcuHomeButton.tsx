import { PropsWithChildren, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'

type WithEcuHomeButtonPropsType = PropsWithChildren<any>

function WithEcuHomeButton({ children }: WithEcuHomeButtonPropsType) {
  const [displayed, setDisplayed] = useState(true)

  return (
    <>
      {displayed && (
        <Button
          position="fixed"
          top={16}
          right={16}
          as={Link}
          to="/_ecu_/components"
        >
          Ecu
        </Button>
      )}
      {children}
    </>
  )
}

export default WithEcuHomeButton
