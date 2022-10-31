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

import { FileNodeType, FunctionNodeType, HierarchyPositionType, HistoryMutationReturnType, ImportDeclarationsRegistry } from '../../types'

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesBySecondNeighbourg } from '../../graph'
import updateKKGraphHash from '../../graph/hash/updateGraphHash'

import updateComponentHierarchy from '../../domain/updateComponentHierarchy'
import createHierarchyIdsAndKeys from '../../domain/createDataEcuAttributes'
import regenerate from '../../domain/regenerate'

type MoveComponentArgs = {
  sourceComponentAddress: string
  sourceHierarchyIds: string[]
  targetHierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function moveComponent(_: any, { sourceComponentAddress, sourceHierarchyIds, targetHierarchyIds, hierarchyPosition }: MoveComponentArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  console.log('___moveComponent___')

  const sourceComponentNode = getNodeByAddress(sourceComponentAddress)

  if (!sourceComponentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(sourceComponentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${sourceComponentAddress} not found`)
  }

  console.log('sourceHierarchyIds', sourceHierarchyIds)
  console.log('targetHierarchyIds', targetHierarchyIds)

  function mutate(x: any, previousX: any) {
    // try {
    //   const finalX = previousX || x

    //   if (hierarchyPosition === 'before') {
    //     let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

    //     if (finalX.parent.type !== 'JSXElement') {
    //       inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [inserted, finalX.node])

    //       finalX.replaceWith(inserted)
    //     }
    //     else {
    //       finalX.insertAfter(inserted)
    //     }
    //   }
    //   else if (hierarchyPosition === 'after') {
    //     let inserted: any = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

    //     if (finalX.parent.type !== 'JSXElement') {
    //       inserted = jsxFragment(jsxOpeningFragment(), jsxClosingFragment(), [finalX.node, inserted])

    //       finalX.replaceWith(inserted)
    //     }
    //     else {
    //       finalX.insertAfter(inserted)
    //     }
    //   }
    //   else if (hierarchyPosition === 'within') {
    //     const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

    //     finalX.node.children.push(inserted)
    //   }
    //   else if (hierarchyPosition === 'children') {
    //     const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(targetComponentNode.payload.name), [], true), null, [], true)

    //     finalX.node.children.push(inserted)
    //   }
    //   else if (hierarchyPosition === 'parent') {
    //     const identifier = jsxIdentifier(targetComponentNode.payload.name)
    //     const inserted = jsxElement(jsxOpeningElement(identifier, [], false), jsxClosingElement(identifier), [finalX.node], false)

    //     finalX.replaceWith(inserted)
    //   }
    // }
    // catch (error) {
    //   console.log(error)
    // }
  }

  function postTraverse(fileNode: FileNodeType, ast: ParseResult<File>, importDeclarationsRegistry: ImportDeclarationsRegistry) {
    // if (targetComponentNode.payload.path !== fileNode.payload.path) {
    //   const importDeclarations = importDeclarationsRegistry[fileNode.address]

    //   if (!importDeclarations.length) return

    //   const relativePathBetweenModules = path.relative(path.dirname(fileNode.payload.path), path.dirname(targetComponentNode.payload.path))
    //   let relativePath = path.join(relativePathBetweenModules, targetComponentNode.payload.name)

    //   if (!relativePath.startsWith('.')) {
    //     relativePath = `./${relativePath}`
    //   }

    //   if (!importDeclarations.some(x => x.value === relativePathBetweenModules && x.specifiers.some(s => s === targetComponentNode.payload.name))) {
    //     traverse(ast, {
    //       ImportDeclaration(path: any) {
    //         path.insertBefore(importDeclaration([importDefaultSpecifier(identifier(targetComponentNode.payload.name))], stringLiteral(relativePath)))

    //         path.stop()
    //       },
    //     })
    //   }
    // }
  }

  // const impacted = updateComponentHierarchy(fileNode, hierarchyIds, mutate)
  // let impactedComponentNode: FunctionNodeType | null = null

  // await Promise.all(impacted.map(async ({ fileNode, ast, importDeclarationsRegistry }) => {
  //   console.log('impacted:', fileNode.payload.name)

  //   postTraverse(fileNode, ast, importDeclarationsRegistry)

  //   const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

  //   if (!componentNode) return

  //   createHierarchyIdsAndKeys(componentNode, ast)

  //   const regenerated = await regenerate(fileNode, ast)

  //   if (regenerated) {
  //     impactedComponentNode = componentNode
  //   }
  // }))
  // .catch(error => {
  //   console.error(error)
  // })

  return {
    returnValue: null,
    impactedFileNodes: [],
    description: `Move component ${sourceComponentNode.payload.name}`,
  }
}

export default moveComponent
