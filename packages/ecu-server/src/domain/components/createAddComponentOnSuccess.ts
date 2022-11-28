import { NodePath } from '@babel/traverse'
import {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
  jsxAttribute,
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxFragment,
  jsxIdentifier,
  jsxOpeningElement,
  jsxOpeningFragment,
  stringLiteral,
} from '@babel/types'

import { HierarchyPositionType } from '../../types.js'

function createAddComponentOnSuccess(targetComponentName: string, targetComponentChildren: (JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment)[], targetComponentClassName: string, hierarchyPosition: HierarchyPositionType, componentDelta: number) {
  return function onSuccess(paths: NodePath<JSXElement>[]) {
    const finalPath = paths[paths.length - 1 + componentDelta]
    const identifier = jsxIdentifier(targetComponentName)
    const hasChildren = targetComponentChildren.length > 0
    const selfClosing = !hasChildren
    const attributes = []

    if (targetComponentClassName) {
      attributes.push(jsxAttribute(jsxIdentifier('className'), stringLiteral(targetComponentClassName)))
    }

    if (hierarchyPosition === 'before') {
      let inserted: any = jsxElement(jsxOpeningElement(identifier, attributes, selfClosing), hasChildren ? jsxClosingElement(identifier) : null, targetComponentChildren, selfClosing)

      if (finalPath.parent.type !== 'JSXElement' && finalPath.parent.type !== 'JSXFragment') {
        inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [inserted, finalPath.node])

        finalPath.replaceWith(inserted)
      }
      else {
        finalPath.insertBefore(inserted)
      }
    }
    else if (hierarchyPosition === 'after') {
      let inserted: any = jsxElement(jsxOpeningElement(identifier, attributes, selfClosing), hasChildren ? jsxClosingElement(identifier) : null, targetComponentChildren, selfClosing)

      if (finalPath.parent.type !== 'JSXElement' && finalPath.parent.type !== 'JSXFragment') {
        inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [finalPath.node, inserted])

        finalPath.replaceWith(inserted)
      }
      else {
        finalPath.insertAfter(inserted)
      }
    }
    else if (hierarchyPosition === 'children') {
      const inserted = jsxElement(jsxOpeningElement(identifier, attributes, selfClosing), hasChildren ? jsxClosingElement(identifier) : null, targetComponentChildren, selfClosing)

      finalPath.node.children.push(inserted)
    }
    else if (hierarchyPosition === 'parent') {
      const inserted = jsxElement(jsxOpeningElement(identifier, attributes, false), jsxClosingElement(identifier), [finalPath.node], false)

      finalPath.replaceWith(inserted)
    }
  }
}

export default createAddComponentOnSuccess
