import { useMemo } from 'react'
import { Div } from 'honorable'

import { CssValuesType } from '../../types'

import areCssValuesEqual from '../../utils/areCssValuesEqual'

type StylesSubSectionTitlePropsType = {
  title: string
  expanded: boolean
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  attributeNames: string[]
}

// Display the title of a styles sub section
// With a chip if modified
function StylesSubSectionTitle({ title, expanded, cssValues, breakpointCssValues, attributeNames }: StylesSubSectionTitlePropsType) {
  const isModified = useMemo(() => attributeNames.some(attributeName => typeof cssValues[attributeName] !== 'undefined'), [cssValues, attributeNames])
  const isBreakpointModified = useMemo(() => !areCssValuesEqual(cssValues, breakpointCssValues) && attributeNames.some(attributeName => typeof breakpointCssValues[attributeName] !== 'undefined'), [cssValues, breakpointCssValues, attributeNames])

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
      {isBreakpointModified && !expanded && (
        <Div
          width={5}
          height={5}
          backgroundColor="breakpoint"
          borderRadius="50%"
        />
      )}
    </Div>
  )
}

export default StylesSubSectionTitle
