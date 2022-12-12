import { HierarchyType } from '~types'

import project, { projectReady } from '~processors/typescript'

async function deleteNode(hierarchy: HierarchyType, shouldLog = false) {
  await projectReady.promise

  return deleteNodeSync(hierarchy, shouldLog)
}

function deleteNodeSync(hierarchy: HierarchyType, shouldLog = false) {
  const consoleLog = shouldLog ? console.log : () => {}

  consoleLog('deleteNodeSync', hierarchy.id)
}

export default deleteNode
