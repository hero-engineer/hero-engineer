import {
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxFragment,
  jsxIdentifier,
  jsxOpeningElement,
  jsxOpeningFragment,
} from '@babel/types'

import { FunctionNodeType, HierarchyPositionType, MutateType } from '../../../types'

function createAddComponentMutate(componentNode: FunctionNodeType, hierarchyPosition: HierarchyPositionType): MutateType {
  return (x: any, previousX: any) => {
    try {
      const finalX = previousX || x

      if (hierarchyPosition === 'before') {
        let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

        if (finalX.parent.type !== 'JSXElement' && finalX.parent.type !== 'JSXFragment') {
          inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [inserted, finalX.node])

          finalX.replaceWith(inserted)
        }
        else {
          finalX.insertAfter(inserted)
        }
      }
      else if (hierarchyPosition === 'after') {
        let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

        if (finalX.parent.type !== 'JSXElement' && finalX.parent.type !== 'JSXFragment') {
          inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [finalX.node, inserted])

          finalX.replaceWith(inserted)
        }
        else {
          finalX.insertAfter(inserted)
        }
      }
      else if (hierarchyPosition === 'within') {
        const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

        finalX.node.children.push(inserted)
      }
      else if (hierarchyPosition === 'children') {
        const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

        finalX.node.children.push(inserted)
      }
      else if (hierarchyPosition === 'parent') {
        const identifier = jsxIdentifier(componentNode.payload.name)
        const inserted = jsxElement(jsxOpeningElement(identifier, [], false), jsxClosingElement(identifier), [finalX.node], false)

        finalX.replaceWith(inserted)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
}

export default createAddComponentMutate
