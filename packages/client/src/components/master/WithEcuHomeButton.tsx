import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'
import { GiRosaShield } from 'react-icons/gi'

type WithEcuHomeButtonPropsType = {
  children: ReactNode
}

// A wrapper that displays a button that links to the home scene
function WithEcuHomeButton({ children }: WithEcuHomeButtonPropsType) {
  const [displayed, setDisplayed] = useState(true)

  return (
    <>
      {displayed && (
        <Button
          small
          as={Link}
          to="/_ecu_"
          position="fixed"
          top={8}
          right={8}
          fontSize="0.85em"
        >
          <GiRosaShield />
        </Button>
      )}
      {children}
    </>
  )
}

export default WithEcuHomeButton
