export const zIndexes = {
  tooltip: 99999999999, // 11 9
  snackBar: 9999999999, // 10 9
  modal: 99999, // 5 9
  // emojiPicker: 99999, // 5 9
  colorPicker: 99999, // 5 9
  breakpointsMenu: 99999, // 5 9
  cssSelectorChipMenu: 99999, // 5 9
  componentIframeExpanderHandle: 9999, // 4 9
  retractablePanel: 999, // 3 9
  hierarchyOverlayElement: 99, // 2 9
  tabDropGhost: 9, // 1 9
  hierarchyBarItem: 9, // 1 9
}

export const refetchKeys = {
  all: 'all',
  undoRedoMetadata: 'undoRedoMetadata',
  packages: 'packages',
  packagesUpdates: 'packagesUpdates',
  favicon: 'favicon',
  filePaths: 'filePaths',
  files: 'files',
}

export const hierarchyTypeToColor = {
  component: 'hierarchy-type-component',
  element: 'hierarchy-type-element',
  children: 'hierarchy-type-children',
  array: 'hierarchy-type-array',
  text: 'hierarchy-type-text',
}

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
