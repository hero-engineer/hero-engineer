import fs from 'fs'
import path from 'path'

import { GraphType } from '../../../types'

import configuration from '../../configuration'

import addFile from '../add/addFile'

function buildFilesGraph(graph: GraphType) {
  traverseDirectories(graph, configuration.appPath)
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
