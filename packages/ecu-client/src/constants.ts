import { HierarchyPosition } from './types'

export const hierarchyPositions: HierarchyPosition[] = [
  'before',
  'after',
  'children',
  'parent',
]

export const refetchKeys = {
  all: 'all',
  hierarchy: 'hierarchy',
  component: 'component',
  components: 'components',
  componentScreenshot: 'componentScreenshot',
  isComponentAcceptingChildren: 'isComponentAcceptingChildren',
  fileImports: 'fileImports',
  fileTypes: 'fileTypes',
  canRedo: 'canRedo',
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
