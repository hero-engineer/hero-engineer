import { ImportType } from './types'

export const appPath = '/Users/sven/dev/ecu/app'

export const ecuPropName = 'data-ecu'

export const ecuRelativePath = '.ecu'

export const ecuGraphFileName = 'ecu-graph.json'

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
