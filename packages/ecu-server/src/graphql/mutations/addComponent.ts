import path from 'path'

import {
  File,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxFragment,
  jsxIdentifier,
  jsxOpeningElement,
  jsxOpeningFragment,
  stringLiteral,
} from '@babel/types'

import traverse from '@babel/traverse'

import { ParseResult } from '@babel/parser'

import { FileNodeType, FunctionNodeType, HierarchyPositionType, ImportDeclarationsRegistry } from '../../types'

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesBySecondNeighbourg } from '../../graph'
import updateGraphHash from '../../graph/hash/updateGraphHash'

import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createHierarchyIdsAndKeys from '../../domain/createDataEcuAttributes'
import regenerate from '../../domain/regenerate'

type AddComponentArgs = {
  sourceComponentId: string
  targetComponentId: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function addComponent(_: any, { sourceComponentId, targetComponentId, hierarchyIds, hierarchyPosition }: AddComponentArgs): Promise<FunctionNodeType | null> {
  console.log('___addComponent___')

  const sourceComponentNode = getNodeByAddress(sourceComponentId)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentId} not found`)
  }

  const targetComponentNode = getNodeByAddress(targetComponentId)

  if (!targetComponentNode) {
    throw new Error(`Component with id ${targetComponentId} not found`)
  }

  console.log('hierarchyIds', hierarchyIds)
  // console.log('reducedHierarchy', reducedHierarchyIds)

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${sourceComponentId} not found`)
  }

  function mutate(x: any, previousX: any) {
    try {
      const finalX = previousX || x

      if (hierarchyPosition === 'before') {
        let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

        if (finalX.parent.type !== 'JSXElement') {
          inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [inserted, finalX.node])

          finalX.replaceWith(inserted)
        }
        else {
          finalX.insertAfter(inserted)
        }
      }
      else if (hierarchyPosition === 'after') {
        let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

        if (finalX.parent.type !== 'JSXElement') {
          inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [finalX.node, inserted])

          finalX.replaceWith(inserted)
        }
        else {
          finalX.insertAfter(inserted)
        }
      }
      else if (hierarchyPosition === 'within') {
        const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

        finalX.node.children.push(inserted)
      }
      else if (hierarchyPosition === 'children') {
        const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

        finalX.node.children.push(inserted)
      }
      else if (hierarchyPosition === 'parent') {
        const identifier = jsxIdentifier(targetComponentNode.payload.name)
        const inserted = jsxElement(jsxOpeningElement(identifier, [], false), jsxClosingElement(identifier), [finalX.node], false)

        finalX.replaceWith(inserted)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  function postTraverse(fileNode: FileNodeType, ast: ParseResult<File>, importDeclarationsRegistry: ImportDeclarationsRegistry) {
    if (targetComponentNode.payload.path !== fileNode.payload.path) {
      const importDeclarations = importDeclarationsRegistry[fileNode.address]

      if (!importDeclarations.length) return

      const relativePathBetweenModules = path.relative(path.dirname(fileNode.payload.path), path.dirname(targetComponentNode.payload.path))
      let relativePath = path.join(relativePathBetweenModules, targetComponentNode.payload.name)

      if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`
      }

      if (!importDeclarations.some(x => x.value === relativePathBetweenModules && x.specifiers.some(s => s === targetComponentNode.payload.name))) {
        traverse(ast, {
          ImportDeclaration(path: any) {
            path.insertBefore(importDeclaration([importDefaultSpecifier(identifier(targetComponentNode.payload.name))], stringLiteral(relativePath)))

            path.stop()
          },
        })
      }
    }
  }

  const impacted = updateComponentHierarchy(fileNode, hierarchyIds, mutate)
  let impactedComponentNode: FunctionNodeType | null = null

  await Promise.all(impacted.map(async ({ fileNode, ast, importDeclarationsRegistry }) => {
    console.log('impacted:', fileNode.payload.name)

    postTraverse(fileNode, ast, importDeclarationsRegistry)

    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) return

    createHierarchyIdsAndKeys(componentNode, ast)

    const regenerated = await regenerate(fileNode, ast)

    if (regenerated) {
      impactedComponentNode = componentNode
    }
  }))
  .catch(error => {
    console.error(error)
  })

  await updateGraphHash()

  return impactedComponentNode
}

export default addComponent
