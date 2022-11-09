import traverse from '@babel/traverse'

import { moduleNameToImportNames } from '../../configuration'
import { ImportType } from '../../types'
import parseCode from '../parseCode'

import getGlobalTypes from '../types/getGlobalTypes'

const moduleNameToImportNamesEntries = Object.entries(moduleNameToImportNames)

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
          value: '@global-types',
        })

        return
      }

      const [moduleName] = moduleNameToImportNamesEntries.find(([, importNames]) => importNames.includes(name)) || []

      if (moduleName) {
        typeImports.push({
          name,
          value: moduleName,
        })
      }
    },
  })

  return typeImports
}

export default getTypesImports
