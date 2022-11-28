import { useMemo } from 'react'
import { Div } from 'honorable'

import { CssValueType } from '../../types'

type StylesSubSectionTitlePropsType = {
  title: string
  expanded: boolean
  cssValues: Record<string, CssValueType>
  attributeNames: string[]
}

// Display the title of a styles sub section
// With a chip is modified
function StylesSubSectionTitle({ title, expanded, cssValues, attributeNames }: StylesSubSectionTitlePropsType) {
  const isModified = useMemo(() => attributeNames.some(attributeName => typeof cssValues[attributeName] !== 'undefined'), [cssValues, attributeNames])

  return (
    <Div
      xflex="x4"
      gap={0.5}
    >
      {title}
      {isModified && !expanded && (
        <Div
          width={5}
          height={5}
          backgroundColor="primary"
          borderRadius="50%"
        />
      )}
    </Div>
  )
}

export default StylesSubSectionTitle
