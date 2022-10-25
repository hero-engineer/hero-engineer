import fs from 'fs'
import path from 'path'

import { JSXAttribute, identifier, importDeclaration, importDefaultSpecifier, jsxElement, jsxIdentifier, jsxOpeningElement, stringLiteral } from '@babel/types'
import traverse from '@babel/traverse'
import generate from '@babel/generator'

import { FileNodeType, FunctionNodeType, HierarchyPositionType } from '../types'
import { ecuPropName } from '../configuration'

import graph from '../graph'
import { getNodeByAddress } from '../graph/helpers'

import areArraysEqual from '../utils/areArraysEqual'

import lintFile from './lintFile'
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
  const importReferences: string[] = []
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const currentIndexes = [0]
  const currentHierarchyIds: string[] = []

  const isSuccessiveNodeFound = () => currentHierarchyIds.every((x, i) => x === ids[i]) && currentIndexes.every((x, i) => x === indexes[i])
  const isNodeFound = () => areArraysEqual(currentHierarchyIds, ids) && areArraysEqual(currentIndexes, indexes)

  // console.log('ids', ids)
  // console.log('indexes', indexes)

  function performMutation(path: any) {
    const inserted = jsxElement(jsxOpeningElement(jsxIdentifier(componentNode.payload.name), [], true), null, [], true)

    if (hierarchyPosition === 'before') {
      path.insertBefore(inserted)
    }
    else if (hierarchyPosition === 'after') {
      path.insertAfter(inserted)
    }
    else if (hierarchyPosition === 'within') {
      path.traverse({
        JSXElement(path: any) {
          path.insertBefore(inserted)
        },
      })
    }
  }

  traverse(ast, {
    ImportDeclaration(path: any) {
      importReferences.push(path.node.source.value)
    },
    JSXElement(path: any) {
      if (!path.node) return

      // console.log('currentIndexes', currentIndexes)

      const idIndex = path.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

      if (idIndex !== -1) {
        const hierarchyId = path.node.openingElement.attributes[idIndex].value.value

        if (isSuccessiveNodeFound()) {
          currentHierarchyIds.push(hierarchyId)

          if (isNodeFound()) {
            console.log('SUCCESS')

            performMutation(path)
          }
        }
      }
      else {
        const nextHierarchyId = ids[currentHierarchyIds.length]

        if (!nextHierarchyId) return

        const [componentId] = extractIdAndIndex(nextHierarchyId)
        const componentNode = getNodeByAddress(graph, componentId)

        if (!componentNode) return

             // Name matching to infer component ~ hacky
        if (path.node.openingElement.name.name === componentNode.payload.name) {
          // console.log('componentNode', componentNode.payload.name)

          if (isSuccessiveNodeFound()) {
            currentHierarchyIds.push(nextHierarchyId)

            if (isNodeFound()) {
              console.log('SUCCESS')

              performMutation(path)
            }
          }
        }
      }

      // console.log('currentHierarchyIds', currentHierarchyIds)

      if (path.node.closingElement) {
        currentIndexes.push(0)
      }
      else {
        currentIndexes[currentIndexes.length - 1]++
      }
    },
    JSXClosingElement() {
      currentIndexes.pop()
      currentIndexes[currentIndexes.length - 1]++
    },
  })

  if (componentNode.payload.path !== fileNode.payload.path) {
    const relativePathBetweenModules = path.relative(path.dirname(fileNode.payload.path), path.dirname(componentNode.payload.path))
    let relativePath = path.join(relativePathBetweenModules, componentNode.payload.name)

    if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`

    console.log('relativePathBetweenModules', relativePath)

    if (!importReferences.includes(relativePathBetweenModules)) {
      // TODO find how to cancel a traversal
      let completed = false

      traverse(ast, {
        ImportDeclaration(path: any) {
          if (!completed) {
            path.insertBefore(importDeclaration([importDefaultSpecifier(identifier(componentNode.payload.name))], stringLiteral(relativePath)))

            completed = true
          }
        },
      })
    }
  }

  const { code } = generate(ast)

  fs.writeFileSync(fileNode.payload.path, code, 'utf-8')

  await lintFile(fileNode)
}

export default insertComponentInHierarchy
