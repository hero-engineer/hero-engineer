import { JSXAttribute } from '@babel/types'

import { FileNodeType, FunctionNodeType, HierarchyPositionType } from '../types'

import graph from '../graph'
import { getNodeByAddress } from '../graph/helpers'

import lintFile from './lintFile'
import transformFileCode from './transformFileCode'
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

function areArraysEqual(a: any[], b: any[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

async function insertComponentInHierarchy(
  fileNode: FileNodeType,
  componentNode: FunctionNodeType,
  hierarchyPosition: HierarchyPositionType,
  hierarchyIds: string[],
) {
  console.log('insertComponentInHierarchy', fileNode.payload.name, componentNode.payload.name, hierarchyPosition, hierarchyIds)

  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)

  console.log('ids', ids)
  console.log('indexes', indexes)

  function performMutation(path: any) {

  }

  transformFileCode(fileNode, () => {
    const propName = 'data-ecu'
    const currentIndexes = [0]
    const currentHierarchyIds: string[] = []

    const isSuccessiveNodeFound = () => currentHierarchyIds.every((x, i) => x === ids[i]) && currentIndexes.every((x, i) => x === indexes[i])
    const isNodeFound = () => areArraysEqual(currentHierarchyIds, ids) && areArraysEqual(currentIndexes, indexes)

    return {
      visitor: {
        JSXElement(path: any) {
          if (!path.node) return

          console.log('currentIndexes', currentIndexes)

          const idIndex = path.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === propName)

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

            if (!nextHierarchyId) {
              throw new Error(`Could not find hierarchy id at index ${currentHierarchyIds.length}`)
            }

            const [componentId] = extractIdAndIndex(nextHierarchyId)
            const componentNode = getNodeByAddress(graph, componentId)

            if (!componentNode) {
              throw new Error(`Could not find component node with address ${componentId}`)
            }

             // Name matching to infer component
            if (path.node.openingElement.name.name === componentNode.payload.name) {
              console.log('componentNode', componentNode.payload.name)
              console.log(ids, currentHierarchyIds)
              console.log(indexes, currentIndexes)

              if (isSuccessiveNodeFound()) {
                currentHierarchyIds.push(nextHierarchyId)

                if (isNodeFound()) {
                  console.log('SUCCESS')

                  performMutation(path)
                }
              }
            }
          }

          console.log('currentHierarchyIds', currentHierarchyIds)

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
      },
    }
  })

  await lintFile(fileNode.payload.path)
}

export default insertComponentInHierarchy
