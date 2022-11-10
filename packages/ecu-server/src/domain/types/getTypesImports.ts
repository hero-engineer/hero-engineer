import traverse from '@babel/traverse'

import { externalModulesImports } from '../../configuration'
import { ImportType } from '../../types'
import parseCode from '../parseCode'

import getGlobalTypes from '../types/getGlobalTypes'

function getTypesImports(rawTypes: string) {
  const typeImports: ImportType[] = []
  const { globalTypes } = getGlobalTypes()

  traverse(parseCode(rawTypes), {
    Identifier(path) {
      const { name } = path.node

      const foundGlobalType = globalTypes.find(t => t.name === name)

      if (foundGlobalType) {
        typeImports.push({
          name,
          source: '@global-types',
          type: 'ImportSpecifier',
        })

        return
      }

      const externalImport = externalModulesImports.find(x => x.name === name)

      if (externalImport) {
        typeImports.push(externalImport)
      }
    },
  })

  return typeImports
}

export default getTypesImports
