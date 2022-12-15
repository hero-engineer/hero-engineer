import { CSsAttributesMapType, CssAttributeType, CssValueType } from '~types'

import { cssValueUnits } from '~constants'

import splitSpacingValue from '~utils/splitSpacingValue'

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

function prepareSpacingValue(value: string) {
  return value.split(' ').map(x => x.trim()).filter(x => x.length)
}

// function extractSpacing(value: CssValueType, index: number): CssValueType {
//   if (typeof value === 'number') return value

//   const spacings = prepareSpacingValue(value)

//   return (
//     spacings.length === 4
//       ? spacings[index]
//       : spacings.length === 3
//         ? spacings[index === 0 ? 0 : index === 1 || index === 2 ? 1 : 2]
//         : spacings.length === 2
//           ? spacings[index === 0 || index === 1 ? 0 : 1]
//           : spacings[0]
//   )
// }

function convertSpacing(name: string, value: CssValueType, isImportant: boolean) {
  if (typeof value === 'number') return createSpacingAttributes(name, value, value, value, value, isImportant)

  const spacings = prepareSpacingValue(value)

  if (spacings.length === 1) return createSpacingAttributes(name, spacings[0], spacings[0], spacings[0], spacings[0], isImportant)
  if (spacings.length === 2) return createSpacingAttributes(name, spacings[0], spacings[1], spacings[0], spacings[1], isImportant)
  if (spacings.length === 3) return createSpacingAttributes(name, spacings[0], spacings[1], spacings[2], spacings[1], isImportant)
  if (spacings.length === 4) return createSpacingAttributes(name, spacings[0], spacings[1], spacings[2], spacings[3], isImportant)

  return createSpacingAttributes(name, spacings[0], spacings[0], spacings[0], spacings[0], isImportant)
}

function createSpacingAttributes(name: string, top: CssValueType, right: CssValueType, bottom: CssValueType, left: CssValueType, isImportant: boolean): CssAttributeType[] {
  return [
    { cssName: `${name}-top`, jsName: `${name}Top`, value: top, isImportant },
    { cssName: `${name}-right`, jsName: `${name}Right`, value: right, isImportant },
    { cssName: `${name}-bottom`, jsName: `${name}Bottom`, value: bottom, isImportant },
    { cssName: `${name}-Left`, jsName: `${name}Left`, value: left, isImportant },
  ]
}

function isSpacingValueValid(value: CssValueType) {
  if (typeof value === 'number') return true

  const [rawValue, unit] = splitSpacingValue(value)
  const numericValue = parseFloat(rawValue)

  return (rawValue === 'auto' || rawValue === 'inherit' || numericValue === numericValue) && (unit === 'inherit' || cssValueUnits.includes(unit))
}

function isSpacingsValueValid(value: CssValueType) {
  if (typeof value === 'number') return true

  const spacings = prepareSpacingValue(value)

  return spacings.length <= 4 && spacings.every(isSpacingValueValid)
}

const isSizeValueValid = isSpacingValueValid

function isNumberOrNumberString(value: CssValueType) {
  const numericValue = parseFloat(value.toString())

  return numericValue === numericValue
}

const cssAttributesMap: CSsAttributesMapType = {
  margin: {
    cssNames: ['margin'],
    defaultValue: '0 0 0 0',
    converter: (value, isImportant) => convertSpacing('margin', value, isImportant),
    isValueValid: isSpacingsValueValid,
  },
  'margin-top': {
    cssNames: ['margin-top', 'margin'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 0),
    isValueValid: isSpacingValueValid,
  },
  'margin-right': {
    cssNames: ['margin-right', 'margin'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 1),
    isValueValid: isSpacingValueValid,
  },
  'margin-bottom': {
    cssNames: ['margin-bottom', 'margin'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 2),
    isValueValid: isSpacingValueValid,
  },
  'margin-left': {
    cssNames: ['margin-left', 'margin'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 3),
    isValueValid: isSpacingValueValid,
  },
  padding: {
    cssNames: ['padding'],
    defaultValue: '0 0 0 0',
    converter: (value, isImportant) => convertSpacing('padding', value, isImportant),
    isValueValid: isSpacingsValueValid,
  },
  'padding-top': {
    cssNames: ['padding-top', 'padding'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 0),
    isValueValid: isSpacingValueValid,
  },
  'padding-right': {
    cssNames: ['padding-right', 'padding'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 1),
    isValueValid: isSpacingValueValid,
  },
  'padding-bottom': {
    cssNames: ['padding-bottom', 'padding'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 2),
    isValueValid: isSpacingValueValid,
  },
  'padding-left': {
    cssNames: ['padding-left', 'padding'],
    defaultValue: 0,
    // extractValue: value => extractSpacing(value, 3),
    isValueValid: isSpacingValueValid,
  },
  display: {
    cssNames: ['display'],
    defaultValue: 'block',
    isValueValid: value => typeof value === 'string' && cssDisplayValues.includes(value),
  },
  'flex-direction': {
    cssNames: ['flex-direction'],
    defaultValue: 'row',
    isValueValid: value => typeof value === 'string' && cssFlexDirectionValues.includes(value),
  },
  'align-items': {
    cssNames: ['align-items'],
    defaultValue: 'stretch',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'justify-items': {
    cssNames: ['justify-items'],
    defaultValue: 'stretch',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'justify-content': {
    cssNames: ['justify-content'],
    defaultValue: 'flex-start',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'align-content': {
    cssNames: ['align-content'],
    defaultValue: 'stretch',
    isValueValid: value => typeof value === 'string' && cssAlignItemsValues.includes(value),
  },
  'flex-wrap': {
    cssNames: ['flex-wrap'],
    defaultValue: 'nowrap',
    isValueValid: value => typeof value === 'string' && cssFlexWrapValues.includes(value),
  },
  'row-gap': {
    cssNames: ['row-gap'],
    defaultValue: '0px', // A bit of a hack, to make the gap editor display no modified value on 0px // TODO investigate
    isValueValid: isSpacingValueValid,
  },
  'grid-auto-flow': {
    cssNames: ['grid-auto-flow'],
    defaultValue: 'row',
    isValueValid: value => typeof value === 'string' && cssGridAutoFlowValues.includes(value),
  },
  'column-gap': {
    cssNames: ['column-gap'],
    defaultValue: '0px',
    isValueValid: isSpacingValueValid,
  },
  width: {
    cssNames: ['width'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'min-width': {
    cssNames: ['min-width'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'max-width': {
    cssNames: ['max-width'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  height: {
    cssNames: ['height'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'min-height': {
    cssNames: ['min-height'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'max-height': {
    cssNames: ['max-height'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  overflow: {
    cssNames: ['overflow'],
    defaultValue: 'visible',
    isValueValid: value => typeof value === 'string' && cssOverflowValues.includes(value),
  },
  'overflow-x': {
    cssNames: ['overflow-x'],
    defaultValue: 'visible',
    isValueValid: value => typeof value === 'string' && cssOverflowValues.includes(value),
  },
  'overflow-y': {
    cssNames: ['overflow-y'],
    defaultValue: 'visible',
    isValueValid: value => typeof value === 'string' && cssOverflowValues.includes(value),
  },
  position: {
    cssNames: ['position'],
    defaultValue: 'static',
    isValueValid: value => typeof value === 'string' && cssPositionValues.includes(value),
  },
  top: {
    cssNames: ['top'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  right: {
    cssNames: ['right'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  bottom: {
    cssNames: ['bottom'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  left: {
    cssNames: ['left'],
    defaultValue: 'auto',
    isValueValid: isSizeValueValid,
  },
  'font-family': {
    cssNames: ['font-family'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string',
  },
  'font-size': {
    cssNames: ['font-size'],
    defaultValue: 'inherit',
    isValueValid: isSizeValueValid,
  },
  'font-weight': {
    cssNames: ['font-weight'],
    defaultValue: 'inherit',
    isValueValid: value => isNumberOrNumberString(value) || value === 'inherit',
  },
  'font-style': {
    cssNames: ['font-style'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssFontStyleValues.includes(value) || value === 'inherit',
  },
  'text-align': {
    cssNames: ['text-align'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssTextAlignValues.includes(value) || value === 'inherit',
  },
  'text-decoration': {
    cssNames: ['text-decoration'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssTextDecorationValues.includes(value) || value === 'inherit',
  },
  'text-transform': {
    cssNames: ['text-transform'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssTextTransformValues.includes(value) || value === 'inherit',
  },
  'text-shadow': {
    cssNames: ['text-shadow'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string',
  },
  'line-height': {
    cssNames: ['line-height'],
    defaultValue: 'inherit',
    isValueValid: value => isSizeValueValid(value) || value === 'inherit',
  },
  'letter-spacing': {
    cssNames: ['letter-spacing'],
    defaultValue: 'inherit',
    isValueValid: value => isSizeValueValid(value) || value === 'inherit',
  },
  'word-spacing': {
    cssNames: ['word-spacing'],
    defaultValue: 'inherit',
    isValueValid: value => isSizeValueValid(value) || value === 'inherit',
  },
  color: {
    cssNames: ['color'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string',
  },
  'white-space': {
    cssNames: ['white-space'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssWhiteSpaceValues.includes(value) || value === 'inherit',
  },
  direction: {
    cssNames: ['direction'],
    defaultValue: 'inherit',
    isValueValid: value => typeof value === 'string' && cssDirectionValues.includes(value) || value === 'inherit',
  },
} as const

export default cssAttributesMap
