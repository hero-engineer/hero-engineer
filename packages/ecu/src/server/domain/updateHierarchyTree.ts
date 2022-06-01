import { JSXElement, JSXIdentifier } from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { parseJsx } from './helpers'

export type UpdateHierarchyAstResolverType = (path: NodePath<JSXElement>, within: boolean) => void

export function updateHierarchyAst(
  path: NodePath<any>,
  resolver: UpdateHierarchyAstResolverType,
  targetIndex: string,
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
          resolver(path, false)
          path.stop()

          return
        }

        if (path.node.openingElement.selfClosing && `${currentIndex}.0` === targetIndex) {
          const { name } = path.node.openingElement.name as JSXIdentifier

          path.node.openingElement.selfClosing = false
          path.node.closingElement = parseJsx(`<${name}></${name}>`).closingElement

          resolver(path, true)
          path.stop()
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
