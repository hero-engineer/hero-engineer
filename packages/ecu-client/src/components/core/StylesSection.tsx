import { memo } from 'react'
import { Div } from 'honorable'

// The styles section
// Displayed in the right panel
function StylesSection() {
  return (
    <Div
      xflex="y2s"
      width={256}
    >
      StylesSection
    </Div>
  )
}

export default memo(StylesSection)
