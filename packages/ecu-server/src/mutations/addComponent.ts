import { HierarchyPositionType, getNodeById } from 'ecu-common'

import graph from '../graph'

type AddComponentArgs = {
  componentId: string
  hierarchyId: string
  hierarchyPosition: HierarchyPositionType
}

async function addComponent(_: any, { componentId, hierarchyId, hierarchyPosition }: AddComponentArgs) {
  const componentNode = getNodeById(graph, componentId)

  if (!componentNode) {
    throw new Error(`Component with id ${componentId} not found`)
  }

  const {
    fileNode: targetFileNode,
    componentNode: targetComponentNode,
  } = decomposeHierarchyId(hierarchyId)

  // if (!fs.existsSync(path.join(componentsLocation, `${name}.tsx`))) {
  //   throw new Error('Component does not exists')
  // }

  // const component: ComponentType = {
  //   name,
  //   props: {},
  //   importName: name,
  //   importPath: `/components/${name}`,
  //   importType: 'default',
  // }

  // insertComponentInHierarchy(appFile, appComponent, component, index, position)
  // lintFile(appFile)

  // return component
}

export default addComponent
