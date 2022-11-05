import traverseComponent from '../../domain/traversal/traverseComponent'
import { FileNodeType, FunctionNodeType, HierarchyItemType } from '../../types'

import { getNodesByFirstNeighbourg } from '../../graph'

type HierarchyQueryArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function formatHierarchyTrees(hierarchyTrees: any[]) {
  const retval: any[] = []

  hierarchyTrees.forEach(hierarchyTree => {
    delete hierarchyTree.hierarchyId
    delete hierarchyTree.componentAddress
    delete hierarchyTree.onComponentAddress
    delete hierarchyTree.index

    const toPush = [hierarchyTree.label]
    const children = formatHierarchyTrees(hierarchyTree.children)

    if (children.length) toPush.push(children)

    retval.push(toPush)
  })

  return retval.flat()
}

function hierarchyQuery(_: any, { sourceComponentAddress, hierarchyIds }: HierarchyQueryArgs) {
  console.log('__getHierarchy__')

  const hierarchy: HierarchyItemType[] = [] // retval

  // // On file traversal, add the component to the hierarchy
  // function onTraverseFile(fileNodes: FileNodeType[], _indexRegistriesHash: string, componentRootIndexes: number[]) {
  //   const fileNode = fileNodes[fileNodes.length - 1]
  //   const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

  //   if (!componentNode) {
  //     console.log(`No component node found in file ${fileNode.address}`)

  //     return () => {}
  //   }

  //   const label = `${componentNode.payload.name}[${componentRootIndexes[componentRootIndexes.length - 1]}]`

  //   hierarchy.push({
  //     label,
  //     componentAddress: componentNode.address,
  //     componentName: componentNode.payload.name,
  //   })

  //   return () => {
  //     for (let i = hierarchy.length - 1; i >= 0; i--) {
  //       const popped = hierarchy.pop()

  //       if (popped?.label === label) break
  //     }
  //   }
  // }

  // // On DOM node traversal, add the hierarchyId to the hierarchy
  // function onHierarchyPush(paths: any[], _fileNodes: FileNodeType[], _indexRegistriesHash: string, _componentRootIndexes: number[], componentIndex: number, hierarchyId: string) {
  //   const lastPath = paths[paths.length - 1]

  //   hierarchy.push({
  //     hierarchyId,
  //     label: `${lastPath.node.openingElement.name.name}[${componentIndex}]`,
  //     componentName: lastPath.node.openingElement.name.name,
  //   })
  // }

  // // Retrieve hierarchy
  try {
    const hierarchyTrees = traverseComponent(sourceComponentAddress, [])
    console.log('Z hierarchy', JSON.stringify(hierarchyTrees, null, 2))
  }
  catch (error) {
    console.log(error)
  }

  return hierarchy
}

export default hierarchyQuery
