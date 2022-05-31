import { ExpressionStatement, JSXElement, JSXIdentifier } from '@babel/types'
import { ParserOptions, parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import generate, { GeneratorOptions } from '@babel/generator'

import babelConfig from './babel.config'

import { parseJsx } from './helpers'

export type UpdateHierarchyAstResolverType = (path: NodePath<JSXElement>) => void

export function updateHierarchyAst(
  path: NodePath<any>,
  resolver: UpdateHierarchyAstResolverType,
  openElement: boolean,
  targetIndex: string
) {
  let currentIndex = '-1'

  traverse(
    path.node,
    {
      JSXElement(path) {
        const indexArray = currentIndex.split('.')
        const last = parseInt(indexArray.pop())

        currentIndex = [...indexArray, last + 1].join('.')

        if (targetIndex === currentIndex) {
          if (openElement) {
            const { name } = path.node.openingElement.name as JSXIdentifier

            path.node.openingElement.selfClosing = false
            path.node.closingElement = parseJsx(`<${name}></${name}>`).closingElement
          }

          resolver(path)
        }
      },
      JSXOpeningElement(path) {
        if (!path.node.selfClosing) {
          currentIndex += '.-1'
        }
      },
      JSXClosingElement() {
        const indexArray = currentIndex.split('.')

        indexArray.pop()
        currentIndex = indexArray.join('.')
      },
    },
    path.scope,
    path,
  )
}
