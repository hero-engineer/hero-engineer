import { ReactNode, useCallback, useMemo } from 'react'
import { Div } from 'honorable'
import { BiUndo } from 'react-icons/bi'

import { CssAttributeType, CssValuesType } from '@types'

import { cssAttributesMap, cssValueReset } from '@constants'

import useTimer from '@hooks/useTimer'
import useStylesSubSectionHelpers from '@hooks/useStylesSubSectionHelpers'

type StylesSubSectionAttributeTitlePropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  attributeNames: string[]
  minWidth?: number
  children: ReactNode
  onChange: (attributes: CssAttributeType[]) => void
}

function StylesSubSectionAttributeTitle({ cssValues, breakpointCssValues, attributeNames, minWidth = 52, children, onChange }: StylesSubSectionAttributeTitlePropsType) {
  const { isCompleted, start, stop } = useTimer(250)

  const { getTextColor } = useStylesSubSectionHelpers(cssValues, breakpointCssValues)

  const handleMenuMouseUp = useCallback(() => {
    onChange(attributeNames.map(name => ({ name, value: cssValueReset })))
  }, [attributeNames, onChange])

  const isResetable = useMemo(() => (
    attributeNames
    .map(attributeName => (
      typeof breakpointCssValues[attributeName] !== 'undefined'
      && breakpointCssValues[attributeName] !== cssValues[attributeName]
      && (typeof cssValues[attributeName] !== 'undefined' || breakpointCssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue)
        ? true
        : (
          typeof cssValues[attributeName] !== 'undefined'
          && ((typeof breakpointCssValues[attributeName] !== 'undefined' && breakpointCssValues[attributeName] !== cssValues[attributeName]) || cssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue)
        )
    ))
    .reduce((acc, color) => color || acc, false)
  ), [attributeNames, breakpointCssValues, cssValues])

  return (
    <Div
      position="relative"
      minWidth={minWidth}
      color={getTextColor(attributeNames)}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      cursor={isResetable ? 'pointer' : 'default'}
    >
      {children}
      {isResetable && isCompleted && (
        <Div
          xflex="x4"
          position="absolute"
          bottom="100%"
          left={0}
          right={0}
        >
          <Div
            xflex="x5"
            cursor="pointer"
            backgroundColor="background"
            color="text"
            border="1px solid border"
            borderRadius="medium"
            _hover={{ backgroundColor: 'danger', color: 'white' }}
            onMouseUp={handleMenuMouseUp}
            p={0.25}
            mb={0.25 / 2}
          >
            <BiUndo />
          </Div>
        </Div>
      )}
    </Div>
  )
}

export default StylesSubSectionAttributeTitle
