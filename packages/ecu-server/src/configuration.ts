import { fileURLToPath } from 'node:url'

import { findUpSync } from 'find-up'

import { ImportType } from './types.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const appPath = findUpSync('app', { cwd: __dirname, type: 'directory' })!

if (!appPath) {
  throw new Error('Could not find app directory, is your cwd a valid ecu project?')
}

export const ecuPropName = 'data-ecu'

export const ecuRelativePath = '.ecu'

export const ecuGraphFileName = 'ecu-graph.json'

export const ecuHistoryFileName = 'ecu-history.json'

export const globalTypesFileRelativePath = 'src/types.ts'

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

export const ecuAcceptingChildrenComponentNames = [
  'Div',
]
