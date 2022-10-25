import fs from 'fs'
import path from 'path'

import { GraphType } from '../../types'
import { appPath } from '../../configuration'

import addFile from '../add/addFile'
import addFileDependencies from '../add/addFileDependencies'
import { getNodesByRole } from '../helpers'

function buildFilesGraph(graph: GraphType) {
  traverseDirectories(graph, appPath)

  getNodesByRole(graph, 'File').forEach(fileNode => {
    addFileDependencies(graph, fileNode)
  })
}

function traverseDirectories(graph: GraphType, rootPath: string) {
  fs.readdirSync(rootPath).forEach(fileName => {
    const filePath = path.join(rootPath, fileName)

    if (fs.statSync(filePath).isDirectory() && fileName !== 'node_modules') {
      traverseDirectories(graph, filePath)
    }
    else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      addFile(graph, filePath)
    }
  })
}

export default buildFilesGraph
