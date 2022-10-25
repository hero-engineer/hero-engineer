import { FileNodeType, HierarchyPositionType } from '../../types'

import graph from '../../graph'
import { getNodeById, getNodesBySecondNeighbourg } from '../../graph/helpers'

import lintFile from '../../domain/lintFile'
import insertComponentInHierarchy from '../../domain/insertComponentInHierarchy'
import extractIdAndIndex from '../../domain/extractIdAndIndex'

type AddComponentArgs = {
  componentId: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

function keepLastComponentOfHierarchy(hierarchyIds: string[], n: number) {
  const array = [...hierarchyIds].reverse()
  const ids: string[] = [array.shift() as string]
  let counter = 1

  array.forEach(hierarchyId => {
    if (counter > n) return

    const [lastComponentId] = extractIdAndIndex(ids[ids.length - 1])
    const [componentId] = extractIdAndIndex(hierarchyId)

    if (lastComponentId !== componentId) {
      counter++

      if (counter > n) return
    }

    ids.push(hierarchyId)
  })

  return ids.reverse()
}

function reduceHierarchy(hierarchyIds: string[], hierarchyPosition: HierarchyPositionType) {
  return keepLastComponentOfHierarchy(hierarchyIds, hierarchyPosition === 'within' ? 1 : 2)
}

async function addComponent(_: any, { componentId, hierarchyIds, hierarchyPosition }: AddComponentArgs) {
  console.log('___addComponent___')

  const componentNode = getNodeById(graph, componentId)

  if (!componentNode) {
    throw new Error(`Component with id ${componentId} not found`)
  }

  const reducedHierarchyIds = reduceHierarchy(hierarchyIds, hierarchyPosition)

  console.log('reducedHierarchy', reducedHierarchyIds)

  const [functionNodeId] = reducedHierarchyIds[0].split(':')
  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  await insertComponentInHierarchy(fileNode, componentNode, hierarchyPosition, reducedHierarchyIds)
  await lintFile(fileNode)

  return fileNode.payload
}

export default addComponent
