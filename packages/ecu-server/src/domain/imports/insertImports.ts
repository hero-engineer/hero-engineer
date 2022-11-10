import { ParseResult } from '@babel/core'
import traverse from '@babel/traverse'
import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  importNamespaceSpecifier,
  importSpecifier,
  stringLiteral,
} from '@babel/types'

import { ImportType } from '../../types'

function createImportSpecifier(importx: ImportType) {
  if (importx.type === 'ImportSpecifier') {
    return importSpecifier(identifier(importx.name), identifier(importx.name))
  }
  if (importx.type === 'ImportDefaultSpecifier') {
    return importDefaultSpecifier(identifier(importx.name))
  }
  if (importx.type === 'ImportNamespaceSpecifier') {
    return importNamespaceSpecifier(identifier(importx.name))
  }

  throw new Error(`Unsupported import type: ${importx.type}`)
}

function insertImports(ast: ParseResult, imports: ImportType[]) {
  const importsToInsert = [...imports]

  traverse(ast, {
    ImportDeclaration(path) {
      const { source, specifiers } = path.node

      const foundImports = importsToInsert.filter(x => x.source === source.value)

      if (foundImports.length) {
        foundImports.forEach(foundImport => {
          importsToInsert.splice(importsToInsert.indexOf(foundImport), 1)

          const foundSpecifier = specifiers.find(s => s.local.name === foundImport.name)

          if (!foundSpecifier) {
            specifiers.push(createImportSpecifier(foundImport))
          }
        })
      }
    },
  })

  const moduleNameToImports: Record<string, ImportType[]> = {}

  importsToInsert.forEach(importToInsert => {
    if (!moduleNameToImports[importToInsert.source]) {
      moduleNameToImports[importToInsert.source] = []
    }

    moduleNameToImports[importToInsert.source].push(importToInsert)
  })

  traverse(ast, {
    ImportDeclaration(path) {
      Object.entries(moduleNameToImports).forEach(([source, imports]) => {
        path.insertBefore(
          importDeclaration(
            imports.map(importToinsert => createImportSpecifier(importToinsert)),
            stringLiteral(source),
          )
        )
      })

      path.stop()
    },
  })
}

export default insertImports
