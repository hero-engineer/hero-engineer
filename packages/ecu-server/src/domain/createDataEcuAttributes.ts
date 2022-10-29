import { File, JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'
import traverse from '@babel/traverse'
import shortid from 'shortid'

import { ParseResult } from '@babel/parser'

import { FunctionNodeType } from '../types'
import { ecuPropName } from '../configuration'

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

function createDataEcuAttributes(componentNode: FunctionNodeType, ast: ParseResult<File>) {
  const cursors = [0]
  const importedEcuComponentNames: string[] = []

  const insertEcuProp = insertPropFactory(ecuPropName, () => `${componentNode.address}:${cursors.join('_')}`)

  traverse(ast, {
    ImportDeclaration(path: any) {
      if (path.node.source.value === 'ecu-client') {
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
    JSXClosingElement() {
      cursors.pop()
      cursors[cursors.length - 1]++
    },
  })

  return ast
}

export default createDataEcuAttributes
