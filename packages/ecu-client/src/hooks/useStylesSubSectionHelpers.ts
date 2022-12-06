import { useCallback } from 'react'

import { CssValueType, CssValuesType } from '@types'

import { cssAttributesMap } from '@constants'

function useStylesSubSectionHelpers(cssValues: CssValuesType, breakpointCssValues: CssValuesType) {
  const getValue = useCallback((attributeName: string) => breakpointCssValues[attributeName] ?? cssValues[attributeName] ?? cssAttributesMap[attributeName].defaultValue, [breakpointCssValues, cssValues])

  const getTextColor = useCallback((attributeNames: string[]) => (
    attributeNames
    .map(attributeName => (
      typeof breakpointCssValues[attributeName] !== 'undefined'
      && breakpointCssValues[attributeName] !== cssValues[attributeName]
      && (typeof cssValues[attributeName] !== 'undefined' || breakpointCssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue)
        ? 'breakpoint'
        : typeof cssValues[attributeName] !== 'undefined'
        && ((typeof breakpointCssValues[attributeName] !== 'undefined' && breakpointCssValues[attributeName] !== cssValues[attributeName]) || cssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue)
          ? 'primary'
          : 'text-light'
    ))
    .reduce((acc, color) => color === 'breakpoint' ? color : color === 'primary' ? color : acc, 'text-light')
  ), [breakpointCssValues, cssValues])

  const isToggled = useCallback((attributeName: string, values: CssValueType[]) => values.includes(getValue(attributeName)), [getValue])

  return {
    getValue,
    getTextColor,
    isToggled,
  }
}

export default useStylesSubSectionHelpers
