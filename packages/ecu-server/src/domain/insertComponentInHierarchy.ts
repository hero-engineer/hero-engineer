import { FileNodeType, FunctionNodeType, HierarchyPositionType } from '../types'

async function insertComponentInHierarchy(
  fileNode: FileNodeType,
  componentNode: FunctionNodeType,
  hierarchyPosition: HierarchyPositionType,
  hierarchyIndex: number,
  hierarchyCursors: number[],
) {
  console.log('insertComponentInHierarchy', fileNode.payload.name, componentNode.payload.name, hierarchyPosition, hierarchyIndex, hierarchyCursors)
}

export default insertComponentInHierarchy
