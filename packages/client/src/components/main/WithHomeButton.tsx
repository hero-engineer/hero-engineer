import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'honorable'
import { GiRosaShield } from 'react-icons/gi'

type WithHomeButtonPropsType = {
  children: ReactNode
}

// A wrapper that displays a button that links to the home scene
function WithHomeButton({ children }: WithHomeButtonPropsType) {
  return (
    <>
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
      {children}
    </>
  )
}

export default WithHomeButton
