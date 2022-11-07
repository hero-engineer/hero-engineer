import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration'

import addFile from '../add/addFile'
import addFileDependencies from '../add/addFileDependencies'
import { getNodesByRole } from '..'

function buildFilesGraph() {
  traverseDirectories(appPath)

  getNodesByRole('File').forEach(fileNode => {
    addFileDependencies(fileNode)
  })
}

function traverseDirectories(rootPath: string) {
  fs.readdirSync(rootPath).forEach(fileName => {
    const filePath = path.join(rootPath, fileName)

    if (fs.statSync(filePath).isDirectory() && fileName !== 'node_modules') {
      traverseDirectories(filePath)
    }
    else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      addFile(filePath)
    }
  })
}

export default buildFilesGraph
