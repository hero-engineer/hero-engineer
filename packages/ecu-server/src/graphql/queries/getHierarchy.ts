import traverseComponent from '../../domain/traversal/traverseComponent'
import { FileNodeType, FunctionNodeType, HierarchyItemType } from '../../types'

import { getNodesByFirstNeighbourg } from '../../graph'

type GetComponentArgs = {
  sourceComponentAddress: string
  hierarchyIds: string[]
}

function getHierarchy(_: any, { sourceComponentAddress, hierarchyIds }: GetComponentArgs) {
  console.log('__getHierarchy__')

  const hierarchy: HierarchyItemType[] = [] // retval

  function onTraverseFile(fileNode: FileNodeType, index: number) {
    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) {
      console.log(`No component node found in file ${fileNode.address}`)

      return () => {}
    }

    const label = `${componentNode.payload.name}[${index}]`

    hierarchy.push({
      label,
      componentAddress: componentNode.address,
      componentName: componentNode.payload.name,
    })

    return () => {
      for (let i = hierarchy.length - 1; i >= 0; i--) {
        const popped = hierarchy.pop()

        if (popped?.label === label) break
      }
    }
  }

  function onHierarchyPush(x: any, hierarchyId: string, index: number) {
    hierarchy.push({
      hierarchyId,
      label: `${x.node.openingElement.name.name}[${index}]`,
      componentName: x.node.openingElement.name.name,
    })
  }

  traverseComponent(sourceComponentAddress, hierarchyIds, {
    onTraverseFile,
    onHierarchyPush,
  })

  const lastComponentAddress = [...hierarchy].reverse().find(x => x.componentAddress)?.componentAddress || sourceComponentAddress
  const componentRootHierarchyIds: string[] = []

  function onBeforeHierarchyPush(x: any, hierarchyId: string) {
    componentRootHierarchyIds.push(hierarchyId)

    x.skip()
  }

  traverseComponent(lastComponentAddress, [], {
    onBeforeHierarchyPush,
  })

  console.log('hierarchy', hierarchy)
  console.log('componentRootHierarchyIds', componentRootHierarchyIds)

  return {
    hierarchy,
    componentRootHierarchyIds,
  }
}

export default getHierarchy
