import { externalModulesImports } from '../../configuration.js'
import { ImportType } from '../../types.js'

import traverse from '../traverse.js'
import parseCode from '../parseCode.js'

import getGlobalTypes from './getGlobalTypes.js'

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
