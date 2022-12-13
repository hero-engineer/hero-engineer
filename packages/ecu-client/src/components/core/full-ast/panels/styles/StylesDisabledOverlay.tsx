import { Div } from 'honorable'

// An overlay to block editing whenno classNAme is selected
function StylesDisabledOverlay() {
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
