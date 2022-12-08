import { useMemo } from 'react'
import { Div } from 'honorable'

import { CssValuesType } from '~types'

import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

type StylesSubSectionTitlePropsType = {
  title: string
  expanded: boolean
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  attributeNames: string[]
}

// Display the title of a styles sub section
// With a chip if modified
function StylesTitle({ title, expanded, cssValues, breakpointCssValues, attributeNames }: StylesSubSectionTitlePropsType) {
  const { getTextColor } = useStylesSubSectionHelpers(cssValues, breakpointCssValues)

  const allColors = useMemo(() => attributeNames.map(attributeName => getTextColor([attributeName])), [attributeNames, getTextColor])
  const isModified = useMemo(() => allColors.some(color => color === 'primary'), [allColors])
  const isBreakpointModified = useMemo(() => allColors.some(color => color === 'breakpoint'), [allColors])

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

export default StylesTitle
