import { HierarchyPosition } from './types'

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
] as const

export const cssAttributesMap = {
  'margin-top': {
    attributes: ['margin-top', 'margin'],
    defaultValue: 0,
  },
  'margin-right': {
    attributes: ['margin-right', 'margin'],
    defaultValue: 0,
  },
  'margin-bottom': {
    attributes: ['margin-bottom', 'margin'],
    defaultValue: 0,
  },
  'margin-left': {
    attributes: ['margin-left', 'margin'],
    defaultValue: 0,
  },
  'padding-top': {
    attributes: ['padding-top', 'padding'],
    defaultValue: 0,
  },
  'padding-right': {
    attributes: ['padding-right', 'padding'],
    defaultValue: 0,
  },
  'padding-bottom': {
    attributes: ['padding-bottom', 'padding'],
    defaultValue: 0,
  },
  'padding-left': {
    attributes: ['padding-left', 'padding'],
    defaultValue: 0,
  },
} as const
