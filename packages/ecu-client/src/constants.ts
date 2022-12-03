import { CSsAttributesMapType, CssValueType, HierarchyPosition } from './types'
import splitSpacingValue from './utils/splitSpacingValue'

export const zIndexes = {
  tooltip: 99999999999, // 11 9
  snackBar: 9999999999, // 10 9
  modal: 999999999, // 9 9
  cssClassesSelectorEmojiPicker: 999999999, // 9 9
  emojiPicker: 999999999, // 9 9
  colorPicker: 999999999, // 9 9
  componentIframeWidthExpanderHandle: 99999999, // 8 9
  retractablePanel: 9999999, // 7 9
  contextualInformationVignette: 999999 + 1, // 6 9 + 1
  editionOverlay: 999999, // 6 9
  hierarchyBarItem: 9, // 1 9
}

export const hierarchyPositions: HierarchyPosition[] = [
  'before',
  'after',
  'children',
  'parent',
]

export const refetchKeys = {
  all: 'all',
  component: 'component',
  components: 'components',
  hierarchy: 'hierarchy',
  cssClasses: 'cssClasses',
  componentScreenshot: 'componentScreenshot',
  isComponentAcceptingChildren: 'isComponentAcceptingChildren',
  fileImports: 'fileImports',
  fileTypes: 'fileTypes',
  undoRedoMetadata: 'undoRedoMetadata',
  packages: 'packages',
  packagesUpdates: 'packagesUpdates',
  breakpoints: 'breakpoints',
  fonts: 'fonts',
  colors: 'colors',
  spacings: 'spacings',
  rootCss: 'rootCss',
  favicon: 'favicon',
}

export const ecuAtoms = [
  {
    name: 'Div',
    isComponentAcceptingChildren: true,
  },
  {
    name: 'Text',
    isComponentAcceptingChildren: false,
  },
]

export const ecuAtomPrefix = '__ecu_atom__'

export const ecuSpecials = [
  {
    name: 'children',
    isComponentAcceptingChildren: false,
  },
]

export const ecuSpecialPrefix = '__ecu_special__'

export const cssValueUnits = [
  'function', // Special unit for calc and variables values
  'auto',
  'px',
  '%',
  'rem',
  'em',
  'vw',
  'vh',
  'vmin',
  'vmax',
  'ch',
  'ex',
  'mm',
  'cm',
  'in',
  'pt',
  'pc',
  'svh',
  'lvh',
  'dvh',
] as const

const cssDisplayValues = ['block', 'inline-block', 'flex', 'grid', 'none']
const cssFlexDirectionValues = ['row', 'column']
const cssAlignItemsValues = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline', 'space-between', 'space-around', 'space-evenly']
const cssFlexWrapValues = ['nowrap', 'wrap', 'wrap-reverse']
const cssOverflowValues = ['visible', 'hidden', 'scroll', 'auto']
const cssPositionValues = ['static', 'relative', 'absolute', 'fixed', 'sticky']

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

  return (rawValue === 'auto' || numericValue === numericValue) && unit !== null && cssValueUnits.includes(unit)
}

function isSpacingsValueValid(value: CssValueType) {
  if (typeof value === 'number') return true

  const values = value.split(' ').filter(x => Boolean(x.trim()))

  return values.length <= 4 && values.every(isSpacingValueValid)
}

const isSizeValueValid = isSpacingValueValid

export const cssAttributesMap: CSsAttributesMapType = {
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
} as const

export const spacingSemanticValues = [
  'top',
  'right',
  'bottom',
  'left',
] as const
