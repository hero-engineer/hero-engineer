import { memo, useState } from 'react'
import { Div } from 'honorable'

import CssClassesSelector from './CssClassesSelector'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const [classes, setClasses] = useState<string[]>([])

  return (
    <Div
      xflex="y2s"
      width={256}
      p={0.5}
    >
      <CssClassesSelector
        classes={classes}
        setClasses={setClasses}
      />
    </Div>
  )
}

export default memo(StylesSection)
