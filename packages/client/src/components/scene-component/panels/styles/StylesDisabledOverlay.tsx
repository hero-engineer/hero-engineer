import { useContext } from 'react'
import { Div } from 'honorable'

import StylesContext from '~contexts/StylesContext'

// An overlay to block editing when no className is selected
function StylesDisabledOverlay() {
  const { isDisabled } = useContext(StylesContext)

  if (!isDisabled) return null

  return (
    <Div
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="background-styles-overlay"
      cursor="not-allowed"
      title="Select a class to edit it"
    />
  )
}

export default StylesDisabledOverlay
