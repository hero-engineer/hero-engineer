import { Link, useParams } from 'react-router-dom'
import { Button } from 'honorable'
import { useContext } from 'react'

import LastEditedComponentContext from '@contexts/LastEditedComponentContext'

function LastEditedComponentButton(props: any) {
  const { componentAddress = '' } = useParams()
  const { lastEditedComponent } = useContext(LastEditedComponentContext)

  if (!lastEditedComponent || componentAddress) return null

  return (
    <Button
      ghost
      as={Link}
      to={`/_ecu_/component/${lastEditedComponent.fileAddress}/${lastEditedComponent.componentAddress}`}
      fontSize="0.85rem"
      {...props}
    >
      Go back to
      {' '}
      {lastEditedComponent.componentName}
    </Button>
  )
}

export default LastEditedComponentButton
