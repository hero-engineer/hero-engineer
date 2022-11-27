import path from 'node:path'

import { jsxText } from '@babel/types'

import { AtomType, ImportType } from './types.js'

export const appPath = path.join(process.cwd(), 'app')

export const ecuPackageName = 'ecu'

export const ecuPropName = 'data-ecu'

export const ecuCommitPrefix = '[ecu] '

export const ecuRelativePath = '.ecu'

export const ecuScreenshotsRelativePath = 'screenshots'

export const ecuGraphFileName = 'ecu-graph.json'

export const ecuHistoryFileName = 'ecu-history.json'

export const globalTypesFileRelativePath = 'src/types.ts'

export const indexCssFileRelativePath = 'src/index.css'

export const allowedExtensions = ['ts', 'tsx', 'css']

export const ecuDecoratorsRelativeLocation = 'src/decorators'

export const ecuDecoratorNameSuffix = 'Decorator'

export const ecuCommonDecoratorName = 'EcuCommonDecorator'

export const ecuDisplayNameCommentPrefix = 'ecu-display-name '

export const globalTypesFileBegginingComment = `/* ---
  Please do not delete this file
  as it is needed by the ecu core engine
--- */`

export const importsStartComment = `/* --
  * IMPORTS START
-- */`

export const importsEndComment = `/* --
  * IMPORTS END
-- */`

export const typesStartComment = `/* --
  * TYPES START
-- */`

export const typesEndComment = `/* --
  * TYPES END
-- */`

export const emojiStartComment = `/* --
  * EMOJI START
-- */`

export const emojiEndComment = `/* --
  * EMOJI END
-- */`

export const descriptionStartComment = `/* --
  * DESCRIPTION START
-- */`

export const descriptionEndComment = `/* --
  * DESCRIPTION END
-- */`

export const externalModulesImports: ImportType[] = [
  {
    name: 'PropsWithChildren',
    source: 'react',
    type: 'ImportSpecifier',
  },
  {
    name: 'ReactNode',
    source: 'react',
    type: 'ImportSpecifier',
  },
]

export const ecuAtomPrefix = '__ecu_atom__'

export const ecuAtoms: AtomType[] = [
  {
    id: `${ecuAtomPrefix}Div`,
    name: 'Div',
    isComponentAcceptingChildren: true,
    defaultChildren: [],
  },
  {
    id: `${ecuAtomPrefix}Text`,
    name: 'Text',
    isComponentAcceptingChildren: false,
    defaultChildren: [jsxText("Edit me I'm a Text")],
  },
]
