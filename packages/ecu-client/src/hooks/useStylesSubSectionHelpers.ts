import { useCallback, useContext } from 'react'

import { CssAttributeType, CssValueType } from '~types'

import { cssAttributesMap } from '~constants'

import StylesContext from '~contexts/StylesContext'

import convertCssAttributeCssNameToJs from '~utils/convertCssAttributeCssNameToJs'

function useStylesSubSectionHelpers() {
  const { attributes, breakpointAttributes } = useContext(StylesContext)

  const getValue = useCallback((attributeCssName: string) => (breakpointAttributes[attributeCssName]?.value ?? attributes[attributeCssName]?.value ?? cssAttributesMap[attributeCssName].defaultValue).toString(), [breakpointAttributes, attributes])

  const getIsImportant = useCallback((attributeCssName: string) => breakpointAttributes[attributeCssName]?.isImportant ?? attributes[attributeCssName]?.isImportant ?? false, [breakpointAttributes, attributes])

  const getTextColor = useCallback((attributeCssNames: string[]) => (
    attributeCssNames
    .map(attributeCssName => (
      typeof breakpointAttributes[attributeCssName]?.value !== 'undefined'
      && breakpointAttributes[attributeCssName]?.value !== attributes[attributeCssName]?.value
      && (typeof attributes[attributeCssName]?.value !== 'undefined' || breakpointAttributes[attributeCssName]?.value !== cssAttributesMap[attributeCssName].defaultValue)
        ? 'breakpoint'
        : typeof attributes[attributeCssName]?.value !== 'undefined'
        && ((typeof breakpointAttributes[attributeCssName]?.value !== 'undefined' && breakpointAttributes[attributeCssName]?.value !== attributes[attributeCssName]?.value) || attributes[attributeCssName]?.value !== cssAttributesMap[attributeCssName].defaultValue)
          ? 'primary'
          : 'text-light'
    ))
    .reduce((acc, color) => color === 'breakpoint' ? color : color === 'primary' ? color : acc, 'text-light')
  ), [breakpointAttributes, attributes])

  const isToggled = useCallback((attributeCssName: string, values: CssValueType[]) => values.includes(getValue(attributeCssName)), [getValue])

  const createCssAttribute = useCallback((attributeCssName: string, value: CssValueType, isImportant: boolean) => ({
    cssName: attributeCssName,
    jsName: convertCssAttributeCssNameToJs(attributeCssName),
    value,
    isImportant,
  } as CssAttributeType), [])

  const updateCssAttribute = useCallback((attributeCssName: string, value: CssValueType) => {
    const existingCssAttribute = breakpointAttributes[attributeCssName]

    return existingCssAttribute ? { ...existingCssAttribute, value } : createCssAttribute(attributeCssName, value, false)
  }, [breakpointAttributes, createCssAttribute])

  return {
    getValue,
    getIsImportant,
    getTextColor,
    isToggled,
    createCssAttribute,
    updateCssAttribute,
  }
}

export default useStylesSubSectionHelpers
