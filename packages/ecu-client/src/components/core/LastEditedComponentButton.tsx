import { Link, useMatch } from 'react-router-dom'
import { Button } from 'honorable'

import { useContext } from 'react'

import LastEditedComponentContext from '../../contexts/LastEditedComponentContext'

function LastEditedComponentButton(props: any) {
  const { lastEditedComponent } = useContext(LastEditedComponentContext)
  const matched = useMatch(`/_ecu_/component/${lastEditedComponent?.fileAddress}/${lastEditedComponent?.componentAddress}`)

  if (!lastEditedComponent || matched) return null

  return (
    <Button
      tiny
      backgroundLightDark
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
