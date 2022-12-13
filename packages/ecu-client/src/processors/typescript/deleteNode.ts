import { SourceFile } from 'ts-morph'

import { HierarchyType } from '~types'

import project, { projectReady } from '~processors/typescript'

async function deleteNode(hierarchy: HierarchyType, shouldLog = false) {
  await projectReady.promise

  return deleteNodeSync(hierarchy, shouldLog)
}

function deleteNodeSync(hierarchy: HierarchyType, shouldLog = false) {
  const consoleLog = shouldLog ? console.log : () => {}
  const consoleGroup = shouldLog ? console.group : () => {}
  const consoleGroupEnd = shouldLog ? console.groupEnd : () => {}
  const consoleGroupCollapsed = shouldLog ? console.groupCollapsed : () => {}

  function findNodeByStart(sourceFile: SourceFile, start: number) {
    if (start === -1) return null

    return sourceFile.forEachDescendant(node => {
      if (node.getFullStart() === start) return node
    }) ?? null
  }

  consoleGroupCollapsed('DELETE_NODE_START')

  const start = Date.now()
  const sourceFile = project.getSourceFile(hierarchy.onFilePath)

  if (!sourceFile) {
    consoleLog('SOURCE FILE NOT FOUND')

    return false
  }

  console.log('hierarchy.start', hierarchy.start)

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
