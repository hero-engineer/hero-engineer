import { useCallback, useMemo } from 'react'
import { Div, DivProps } from 'honorable'
import { BiUndo } from 'react-icons/bi'

import { CssAttributeType, CssValuesType } from '~types'

import { cssAttributesMap, cssValueReset } from '~constants'

import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

type StylesSubSectionAttributeTitlePropsType = DivProps & {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  currentBreakpointCssValues: CssValuesType
  attributeNames: string[]
  onChange: (attributes: CssAttributeType[]) => void
}

function StylesAttributeTitle({
  cssValues,
  breakpointCssValues,
  currentBreakpointCssValues,
  attributeNames,
  width = 52,
  children,
  onChange,
  ...props
}: StylesSubSectionAttributeTitlePropsType) {
  const { getTextColor } = useStylesSubSectionHelpers(cssValues, breakpointCssValues)

  const handleResetClick = useCallback(() => {
    onChange(attributeNames.map(name => ({ name, value: cssValueReset })))
  }, [attributeNames, onChange])

  const isResetable = useMemo(() => attributeNames.some(attributeName => typeof currentBreakpointCssValues[attributeName] !== 'undefined' && currentBreakpointCssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue), [attributeNames, currentBreakpointCssValues])
  const color = getTextColor(attributeNames)

  return (
    <Div
      xflex="x4"
      position="relative"
      width={width}
      minWidth={width}
      maxWidth={width}
      color={color}
      textDecoration={isResetable ? 'underline' : 'none'}
      textDecorationThickness={0.5}
      textUnderlineOffset={2}
      textDecor
      _hover={{
        '> #StylesSubSectionAttributeTitle-reset': {
          display: 'flex',
        },
      }}
      {...props}
    >
      <Div
        flexGrow
        ellipsis
      >
        {children}
      </Div>
      {isResetable && (
        <Div
          id="StylesSubSectionAttributeTitle-reset"
          xflex="x5"
          display="none"
          cursor="pointer"
          color="danger"
          px={0.25}
          onClick={handleResetClick}
        >
          <BiUndo />
        </Div>
      )}
    </Div>
  )
}

export default StylesAttributeTitle
