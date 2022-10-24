import { FileNodeType, HierarchyPositionType } from '../types'

import graph from '../graph'
import { getNodeById, getNodesBySecondNeighbourg } from '../graph/helpers'
import lintFile from '../domain/lintFile'
import insertComponentInHierarchy from '../domain/insertComponentInHierarchy'

type AddComponentArgs = {
  componentId: string
  hierarchyIds: string[]
  hierarchyPosition: HierarchyPositionType
}

async function addComponent(_: any, { componentId, hierarchyIds, hierarchyPosition }: AddComponentArgs) {
  const componentNode = getNodeById(graph, componentId)

  if (!componentNode) {
    throw new Error(`Component with id ${componentId} not found`)
  }

  const [functionNodeId, hierarchyCursorsString, hierarchyIndexString] = hierarchyIds[hierarchyIds.length - 1].split(':')
  const hierarchyIndex = parseInt(hierarchyIndexString)
  const hierarchyCursors = hierarchyCursorsString.split('_').map(x => parseInt(x))

  if ([hierarchyIndex, ...hierarchyCursors].some(x => x !== x)) {
    throw new Error('Invalid indexes')
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  await insertComponentInHierarchy(fileNode, componentNode, hierarchyPosition, hierarchyIndex, hierarchyCursors)
  await lintFile(fileNode.payload.path)

  return true
}

export default addComponent
