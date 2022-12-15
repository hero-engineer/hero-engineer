import { HierarchyType } from '~types'

import project, { projectReady } from '~processors/typescript'
import findNodeByStart from '~processors/typescript/findNodeByStart'

async function deleteNode(hierarchy: HierarchyType, shouldLog = false) {
  await projectReady.promise

  const consoleLog = shouldLog ? console.log : () => {}
  const consoleGroupEnd = shouldLog ? console.groupEnd : () => {}
  const consoleGroupCollapsed = shouldLog ? console.groupCollapsed : () => {}

  consoleGroupCollapsed('DELETE_NODE_START')

  const start = Date.now()
  const sourceFile = project.getSourceFile(hierarchy.onFilePath)

  if (!sourceFile) {
    consoleLog('SOURCE FILE NOT FOUND')

    return false
  }

  const node = findNodeByStart(sourceFile, hierarchy.start)

  if (!node) {
    consoleLog('NODE NOT FOUND')

    return false
  }

  consoleLog(node.getText())

  try {
    // @ts-expect-error
    node.remove()
  }
  catch (error) {
    consoleLog(error)
  }

  consoleLog(sourceFile.getFullText())

  consoleGroupEnd()
  consoleLog('DELETE_NODE_END', Date.now() - start)

  return true
}

export default deleteNode
