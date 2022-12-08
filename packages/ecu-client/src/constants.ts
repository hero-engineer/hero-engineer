import { HierarchyPosition } from '~types'

export const zIndexes = {
  tooltip: 99999999999, // 11 9
  snackBar: 9999999999, // 10 9
  modal: 999999999, // 9 9
  cssClassesSelectorEmojiPicker: 999999999, // 9 9
  emojiPicker: 999999999, // 9 9
  colorPicker: 999999999, // 9 9
  breakpointsMenu: 999999999, // 9 9
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

export const cssValueReset = `__reset__${Math.random()}`

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

export const spacingSemanticValues = [
  'top',
  'right',
  'bottom',
  'left',
] as const

export { default as cssAttributesMap } from './cssAttributesMap'
