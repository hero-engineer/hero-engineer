import fs from 'fs'

import generate from '@babel/generator'
import {
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxFragment,
  jsxIdentifier,
  jsxOpeningElement,
  jsxOpeningFragment,
} from '@babel/types'

import { FileNodeType, HierarchyPositionType } from '../../types'

import graph from '../../graph'
import { getNodeById, getNodesBySecondNeighbourg } from '../../graph/helpers'

import keepLastComponentOfHierarchy from '../../domain/keepLastComponentOfHierarchyIds'
import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createAddMissingImportsPostTraversal from '../../domain/createAddMissingImportsPostTraversal'
import lintCode from '../../domain/lintCode'

type AddComponentArgs = {
  componentId: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function addComponent(_: any, { componentId, hierarchyIds, hierarchyPosition }: AddComponentArgs) {
  console.log('___addComponent___')

  const componentNode = getNodeById(graph, componentId)

  if (!componentNode) {
    throw new Error(`Component with id ${componentId} not found`)
  }

  const reducedHierarchyIds = keepLastComponentOfHierarchy(hierarchyIds, hierarchyPosition === 'within' ? 1 : 2)

  console.log('hierarchyIds', hierarchyIds)
  console.log('reducedHierarchy', reducedHierarchyIds)

  const [functionNodeId] = reducedHierarchyIds[0].split(':')
  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  function mutate(x: any, previousX: any) {
    try {
      const finalX = previousX || x

      if (hierarchyPosition === 'before') {
        let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

        if (finalX.parent.type !== 'JSXElement') {
          inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [inserted, finalX.node])

          finalX.replaceWith(inserted)
        }
        else {
          finalX.insertAfter(inserted)
        }
      }
      else if (hierarchyPosition === 'after') {
        let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

        if (finalX.parent.type !== 'JSXElement') {
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

  const postTraverse = createAddMissingImportsPostTraversal(fileNode, componentNode)

  const impacted = updateComponentHierarchy(fileNode, reducedHierarchyIds, mutate, postTraverse)

  await Promise.all(impacted.map(async ({ fileNode, ast }) => {
    console.log('impacted:', fileNode.payload.name)

    let { code } = generate(ast)

    code = await lintCode(code)

    fs.writeFileSync(fileNode.payload.path, code, 'utf-8')
  }))

  return { id: 0 }
}

export default addComponent
