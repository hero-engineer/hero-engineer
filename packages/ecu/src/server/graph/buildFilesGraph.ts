import fs from 'fs'
import path from 'path'

import { parse } from '@babel/parser'

import { FileType, GraphType } from '../../types'

import configuration from '../configuration'

function buildFilesGraph(graph: GraphType) {
  traverseDirectories(graph, configuration.appPath)
}

function traverseDirectories(graph: GraphType, rootPath: string) {
  fs.readdirSync(rootPath).forEach(fileName => {
    const filePath = path.join(rootPath, fileName)
    console.log(filePath)

    const stats = fs.statSync(filePath)

    if (stats.isDirectory() && fileName !== 'node_modules') {
      traverseDirectories(graph, filePath)
    }
    else if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      const text = fs.readFileSync(filePath, 'utf8')

      const file: FileType = {
        id: `File:::${filePath}`,
        type: 'File',
        name: fileName,
        path: filePath,
        text,
        ast: parse(
          text,
          {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          }
        ),
      }

      graph.nodes[file.id] = file
    }
  })
}

export default buildFilesGraph
