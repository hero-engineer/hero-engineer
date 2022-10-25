import fs from 'fs'

import generate from '@babel/generator'

import { FileNodeType, HierarchyPositionType } from '../../types'

import graph from '../../graph'
import { getNodeById, getNodesBySecondNeighbourg } from '../../graph/helpers'

import insertComponentInHierarchy from '../../domain/insertComponentInHierarchy'
import extractIdAndIndex from '../../domain/extractIdAndIndex'
import lintCode from '../../domain/lintCode'

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

    if (extractIdAndIndex(lastComponentId)[0] !== extractIdAndIndex(componentId)[0]) {
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

  console.log('hierarchyIds', hierarchyIds)
  console.log('reducedHierarchy', reducedHierarchyIds)

  const [functionNodeId] = reducedHierarchyIds[0].split(':')
  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, functionNodeId, 'declaresFunction')[0]

  if (!fileNode) {
    throw new Error(`File for Function with id ${functionNodeId} not found`)
  }

  const ast = await insertComponentInHierarchy(fileNode, componentNode, hierarchyPosition, reducedHierarchyIds)

  let { code } = generate(ast)

  code = await lintCode(code)

  fs.writeFileSync(fileNode.payload.path, code, 'utf-8')

  return fileNode.payload
}

export default addComponent
