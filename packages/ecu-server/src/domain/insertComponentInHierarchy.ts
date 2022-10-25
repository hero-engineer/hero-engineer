import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
  stringLiteral,
} from '@babel/types'
import traverse from '@babel/traverse'

import { FileNodeType, FunctionNodeType, HierarchyPositionType } from '../types'
import { ecuPropName } from '../configuration'

import graph from '../graph'
import { getNodesByRole } from '../graph/helpers'

import areArraysEqual from '../utils/areArraysEqual'
import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../utils/possiblyAddExtension'

import extractIdAndIndex from './extractIdAndIndex'

function extractIdsAndIndexes(hierarchyIds: string[]): [string[], number[]] {
  const ids: string[] = []
  const indexes: number[] = []

  for (const hierarchyId of hierarchyIds) {
    const [id, index] = extractIdAndIndex(hierarchyId)

    ids.push(id)
    indexes.push(index)
  }

  return [ids, indexes]
}

async function insertComponentInHierarchy(
  fileNode: FileNodeType,
  componentNode: FunctionNodeType,
  hierarchyPosition: HierarchyPositionType,
  hierarchyIds: string[],
) {
  console.log('insertComponentInHierarchy', fileNode.payload.name, componentNode.payload.name, hierarchyPosition, hierarchyIds)

  const { ast } = fileNode.payload
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(n => n.payload.isComponent)
  const fileNodes = getNodesByRole<FileNodeType>(graph, 'File')
  const fileAddressToImportDeclarations: Record<string, { value: string, specifiers: string[] }[]> = {}
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const currentHierarchyIds: string[] = []
  const currentIndexRegistry: Record<string, number> = {}

  const isSuccessiveNodeFound = (nextHierarchyId: string) => {
    const nextHierarchyIds = [...currentHierarchyIds, nextHierarchyId]

    return areArraysEqualAtStart(nextHierarchyIds, ids) && areArraysEqualAtStart(nextHierarchyIds.map(h => currentIndexRegistry[h]), indexes)
  }
  const isNodeFound = () => areArraysEqual(currentHierarchyIds, ids) && areArraysEqual(currentHierarchyIds.map(hierarchyId => currentIndexRegistry[hierarchyId]), indexes)

  console.log('ids', ids)
  console.log('indexes', indexes)
  console.log('___start___')

  function performMutation(x: any, previousX: any = null) {
    const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

    if (hierarchyPosition === 'before') {
      (previousX || x).insertBefore(inserted)
    }
    else if (hierarchyPosition === 'after') {
      (previousX || x).insertAfter(inserted)
    }
    else if (hierarchyPosition === 'within') {
      (previousX || x).node.children.push(inserted)
    }
    else if (previousX && hierarchyPosition === 'children') {
      previousX.node.children.push(inserted)
    }

    if (previousX) {
      previousX.stop()
    }

    x.stop()
  }

  function createTraversal(fileNode: FileNodeType, previousX: any = null) {
    return {
      ImportDeclaration(x: any) {
        if (!fileAddressToImportDeclarations[fileNode.address]) {
          fileAddressToImportDeclarations[fileNode.address] = []
        }

        fileAddressToImportDeclarations[fileNode.address].push({
          value: x.node.source.value,
          specifiers: x.node.specifiers.map((x: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => x.local.name),
        })
      },
      JSXElement(x: any) {
        if (!x.node) return

        const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

        // hierarchyId found means we're at an ecu-client Component
        if (idIndex !== -1) {
          const hierarchyId = x.node.openingElement.attributes[idIndex].value.value

          if (hierarchyId) {
            console.log('-->', hierarchyId)

            currentIndexRegistry[hierarchyId] = currentIndexRegistry[hierarchyId] + 1 || 0

            if (isSuccessiveNodeFound(hierarchyId)) {
              currentHierarchyIds.push(hierarchyId)

              console.log('PUSHED')

              if (isNodeFound()) {
                console.log('SUCCESS')

                performMutation(x, previousX)

                // console.log('currentHierarchyIds', currentHierarchyIds)
                // console.log('currentIndexRegistry', currentIndexRegistry)

                return
              }
            }
          }
        }
        // No hierarchyId found means we're at an imported Component node
        else {
          const importDeclarations = fileAddressToImportDeclarations[fileNode.address]

          if (importDeclarations.length) {
            const componentName = x.node.openingElement.name.name
            const relativeImportDeclaration = importDeclarations.find(x => x.value.startsWith('.') && x.specifiers.includes(componentName))

            if (relativeImportDeclaration) {
              const absolutePath = possiblyAddExtension(path.join(path.dirname(fileNode.payload.path), relativeImportDeclaration.value))

              console.log('-->', absolutePath)

              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                console.log('componentNode.payload.name', componentNode.payload.name)

                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('fileNode.payload.name', fileNode.payload.name)

                  traverse(fileNode.payload.ast, createTraversal(fileNode, x))
                }
              }
            }
          }
        }

        console.log('currentHierarchyIds', currentHierarchyIds)
        console.log('currentIndexRegistry', currentIndexRegistry)
      },
    }
  }

  traverse(ast, createTraversal(fileNode))

  // if (componentNode.payload.path !== fileNode.payload.path) {
  //   const relativePathBetweenModules = path.relative(path.dirname(fileNode.payload.path), path.dirname(componentNode.payload.path))
  //   let relativePath = path.join(relativePathBetweenModules, componentNode.payload.name)

  //   if (!relativePath.startsWith('.')) {
  //     relativePath = `./${relativePath}`
  //   }

  //   if (!importDeclarations.includes(relativePathBetweenModules)) {
  //     // TODO find how to cancel a traversal
  //     let completed = false

  //     traverse(ast, {
  //       ImportDeclaration(path: any) {
  //         if (!completed) {
  //           path.insertBefore(importDeclaration([importDefaultSpecifier(identifier(componentNode.payload.name))], stringLiteral(relativePath)))

  //           completed = true
  //         }
  //       },
  //     })
  //   }
  // }

  return ast
}

export default insertComponentInHierarchy
