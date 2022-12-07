import { CSsAttributesMapType, CssValueType } from '@types'

import { cssValueUnits } from '@constants'

import splitSpacingValue from './utils/splitSpacingValue'

const cssDisplayValues = ['block', 'inline-block', 'flex', 'grid', 'none']
const cssFlexDirectionValues = ['row', 'column']
const cssAlignItemsValues = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline', 'space-between', 'space-around', 'space-evenly']
const cssFlexWrapValues = ['nowrap', 'wrap', 'wrap-reverse']
const cssGridAutoFlowValues = ['row', 'column', 'row dense', 'column dense']
const cssOverflowValues = ['visible', 'hidden', 'scroll', 'auto']
const cssPositionValues = ['static', 'relative', 'absolute', 'fixed', 'sticky']
const cssFontStyleValues = ['normal', 'italic', 'oblique']
const cssTextAlignValues = ['left', 'right', 'center', 'justify', 'justify-all', 'start', 'end', 'match-parent']
const cssTextDecorationValues = ['none', 'underline', 'overline', 'line-through', 'blink']
const cssTextTransformValues = ['none', 'capitalize', 'uppercase', 'lowercase', 'full-width', 'full-size-kana']
const cssDirectionValues = ['ltr', 'rtl']
const cssWhiteSpaceValues = ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces']

function extractSpacing(value: CssValueType, index: number): CssValueType {
  if (typeof value === 'number') return value

  const spacing = value.split(' ').map(x => x.trim())

  return spacing[index] || spacing[0]
}

function convertSpacing(name: string, value: CssValueType) {
  if (typeof value !== 'string') {
    return {
      [name]: value.toString(),
    }
  }

  const spacings = value.split(' ').map(x => x.trim())

  if (spacings.length === 1) {
    return {
      [`${name}-top`]: value,
      [`${name}-right`]: value,
      [`${name}-bottom`]: value,
      [`${name}-left`]: value,
    }
  }

  if (spacings.length === 2) {
    return {
      [`${name}-top`]: spacings[0],
      [`${name}-right`]: spacings[1],
      [`${name}-bottom`]: spacings[0],
      [`${name}-left`]: spacings[1],
    }
  }

  if (spacings.length === 3) {
    return {
      [`${name}-top`]: spacings[0],
      [`${name}-right`]: spacings[1],
      [`${name}-bottom`]: spacings[2],
      [`${name}-left`]: spacings[1],
    }
  }

  if (spacings.length === 4) {
    return {
      [`${name}-top`]: spacings[0],
      [`${name}-right`]: spacings[1],
      [`${name}-bottom`]: spacings[2],
      [`${name}-left`]: spacings[3],
    }
  }

  return {
    [`${name}-top`]: value,
    [`${name}-right`]: value,
    [`${name}-bottom`]: value,
    [`${name}-left`]: value,
  }
}

function isSpacingValueValid(value: CssValueType) {
  if (typeof value === 'number') return true

  const [rawValue, unit] = splitSpacingValue(value)
  const numericValue = parseFloat(rawValue)

  return (rawValue === 'auto' || rawValue === 'inherit' || numericValue === numericValue) && (unit === 'inherit' || cssValueUnits.includes(unit))
}

function isSpacingsValueValid(value: CssValueType) {
  if (typeof value === 'number') return true

  const values = value.split(' ').filter(x => Boolean(x.trim()))

  return values.length <= 4 && values.every(isSpacingValueValid)
}

const isSizeValueValid = isSpacingValueValid

function isNumberOrNumberString(value: CssValueType) {
  const numericValue = parseFloat(value.toString())

  return numericValue === numericValue
}

const cssAttributesMap: CSsAttributesMapType = {
  margin: {
    attributes: ['margin'],
    defaultValue: '0 0 0 0',
    converter: value => convertSpacing('margin', value),
    isValueValid: isSpacingsValueValid,
  },
  'margin-top': {
    attributes: ['margin-top', 'margin'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 0),
    isValueValid: isSpacingValueValid,
  },
  'margin-right': {
    attributes: ['margin-right', 'margin'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 1),
    isValueValid: isSpacingValueValid,
  },
  'margin-bottom': {
    attributes: ['margin-bottom', 'margin'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 2),
    isValueValid: isSpacingValueValid,
  },
  'margin-left': {
    attributes: ['margin-left', 'margin'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 3),
    isValueValid: isSpacingValueValid,
  },
  padding: {
    attributes: ['padding'],
    defaultValue: '0 0 0 0',
    converter: value => convertSpacing('padding', value),
    isValueValid: isSpacingsValueValid,
  },
  'padding-top': {
    attributes: ['padding-top', 'padding'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 0),
    isValueValid: isSpacingValueValid,
  },
  'padding-right': {
    attributes: ['padding-right', 'padding'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 1),
    isValueValid: isSpacingValueValid,
  },
  'padding-bottom': {
    attributes: ['padding-bottom', 'padding'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 2),
    isValueValid: isSpacingValueValid,
  },
  'padding-left': {
    attributes: ['padding-left', 'padding'],
    defaultValue: 0,
    extractValue: value => extractSpacing(value, 3),
    isValueValid: isSpacingValueValid,
  },
  display: {
    attributes: ['display'],
    defaultValue: 'block',
    isValueValid: value => typeof value === 'string' && cssDisplayValues.includes(value),
  },
  'flex-direction': {
    attributes: ['flex-direction'],
    defaultValue: 'row',
    isValueValid: value => typeof value === 'string' && cssFlexDirectionValues.includes(value),
  },
  'align-items': {
    attributes: ['align-items'],
    defaultValue: 'stretch',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'justify-items': {
    attributes: ['justify-items'],
    defaultValue: 'stretch',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'justify-content': {
    attributes: ['justify-content'],
    defaultValue: 'flex-start',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'align-content': {
    attributes: ['align-content'],
    defaultValue: 'stretch',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'flex-wrap': {
    attributes: ['flex-wrap'],
    defaultValue: 'nowrap',
    isValueValid: value => typeof value === 'string' && cssFlexWrapValues.includes(value),
  },
  'row-gap': {
    attributes: ['row-gap'],
    defaultValue: '0px', // A bit of a hack, to make the gap editor display no modified value on 0px
    isValueValid: isSpacingValueValid,
  },
  'grid-auto-flow': {
    attributes: ['grid-auto-flow'],
    defaultValue: 'row',
    isValueValid: value => typeof value === 'string' && cssGridAutoFlowValues.includes(value),
  },
  'column-gap': {
    attributes: ['column-gap'],
    defaultValue: '0px',
    isValueValid: isSpacingValueValid,
  },
  width: {
    attributes: ['width'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'min-width': {
    attributes: ['min-width'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'max-width': {
    attributes: ['max-width'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  height: {
    attributes: ['height'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'min-height': {
    attributes: ['min-height'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'max-height': {
    attributes: ['max-height'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  overflow: {
    attributes: ['overflow'],
    defaultValue: 'visible',
    isValueValid: value => typeof value === 'string' && cssOverflowValues.includes(value),
  },
  'overflow-x': {
    attributes: ['overflow-x'],
    defaultValue: 'visible',
    isValueValid: value => typeof value === 'string' && cssOverflowValues.includes(value),
  },
  'overflow-y': {
    attributes: ['overflow-y'],
    defaultValue: 'visible',
    isValueValid: value => typeof value === 'string' && cssOverflowValues.includes(value),
  },
  position: {
    attributes: ['position'],
    defaultValue: 'static',
    isValueValid: value => typeof value === 'string' && cssPositionValues.includes(value),
  },
  top: {
    attributes: ['top'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  right: {
    attributes: ['right'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  bottom: {
    attributes: ['bottom'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  left: {
    attributes: ['left'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'font-family': {
    attributes: ['font-family'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string',
  },
  'font-size': {
    attributes: ['font-size'],
    defaultValue: 'inherit',
    isValueValid: isSizeValueValid,
  },
  'font-weight': {
    attributes: ['font-weight'],
    defaultValue: 'inherit',
    isValueValid: value => isNumberOrNumberString(value) || value === 'inherit',
  },
  'font-style': {
    attributes: ['font-style'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssFontStyleValues.includes(value) || value === 'inherit',
  },
  'text-align': {
    attributes: ['text-align'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssTextAlignValues.includes(value) || value === 'inherit',
  },
  'text-decoration': {
    attributes: ['text-decoration'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssTextDecorationValues.includes(value) || value === 'inherit',
  },
  'text-transform': {
    attributes: ['text-transform'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssTextTransformValues.includes(value) || value === 'inherit',
  },
  'text-shadow': {
    attributes: ['text-shadow'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string',
  },
  'line-height': {
    attributes: ['line-height'],
    defaultValue: 'inherit',
    isValueValid: value => isSizeValueValid(value) || value === 'inherit',
  },
  'letter-spacing': {
    attributes: ['letter-spacing'],
    defaultValue: 'inherit',
    isValueValid: value => isSizeValueValid(value) || value === 'inherit',
  },
  'word-spacing': {
    attributes: ['word-spacing'],
    defaultValue: 'inherit',
    isValueValid: value => isSizeValueValid(value) || value === 'inherit',
  },
  color: {
    attributes: ['color'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string',
  },
  'white-space': {
    attributes: ['white-space'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssWhiteSpaceValues.includes(value) || value === 'inherit',
  },
  direction: {
    attributes: ['direction'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssDirectionValues.includes(value) || value === 'inherit',
  },
} as const

export default cssAttributesMap
