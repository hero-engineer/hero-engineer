import { JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'
import { ParseResult } from '@babel/core'

import { FunctionNodeType } from '../../types.js'
import { ecuPackageName, ecuPropName } from '../../configuration.js'

import traverse from '../traverse.js'

import createHierarchyId from '../utils/createHierarchyId.js'

function insertPropFactory(key: string, getValue: () => string) {
  return (path: any) => {
    // Remove previous key props
    do {
      const idIndex = path.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === key)

      if (idIndex === -1) break

      path.node.openingElement.attributes.splice(idIndex, 1)
    } while (true)

    // Add key prop
    path.node.openingElement.attributes.push(
      jsxAttribute(
        jsxIdentifier(key),
        stringLiteral(getValue()),
      )
    )
  }
}

function updateDataEcuAttributes(componentNode: FunctionNodeType, ast: ParseResult) {
  const cursors = [0]
  const importedEcuComponentNames: string[] = []

  const insertEcuProp = insertPropFactory(ecuPropName, () => createHierarchyId(componentNode.address, cursors.join('_')))

  traverse(ast, {
    ImportDeclaration(path: any) {
      if (path.node.source.value === ecuPackageName) {
        importedEcuComponentNames.push(...path.node.specifiers.map((x: any) => x.local.name))
      }
    },
    JSXElement(path: any) {
      if (!importedEcuComponentNames.includes(path.node.openingElement.name.name)) return

      insertEcuProp(path)

      if (path.node.closingElement) {
        cursors.push(0)
      }
      else {
        cursors[cursors.length - 1]++
      }
    },
    JSXClosingElement(path: any) {
      if (!importedEcuComponentNames.includes(path.node.name.name)) return

      cursors.pop()
      cursors[cursors.length - 1]++
    },
  })

  return ast
}

export default updateDataEcuAttributes
