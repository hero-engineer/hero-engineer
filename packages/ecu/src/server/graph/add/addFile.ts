import fs from 'fs'
import path from 'path'

import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

import { FileType, FunctionType, GraphType } from '../../../types'

import { addEdge, addNode } from '../helpers'

function addFile(graph: GraphType, filePath: string) {
  const nameArray = path.basename(filePath).split('.')
  const extension = nameArray.pop()
  const name = nameArray.join('.')

  const file: FileType = {
    id: `File:::${filePath}`,
    type: 'File',
    name,
    extension,
    path: filePath,
    get text() {
      return fs.readFileSync(filePath, 'utf8')
    },
    get ast() {
      return parse(
        this.text,
        {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        }
      )
    },
  }

  addNode(graph, file)

  /* ---
    IMPORTS
  --- */

  file.ast.program.body.forEach(node => {
    if (node.type === 'ImportDeclaration') {
      const { value } = node.source

      if (value.startsWith('.')) {
        const absolutePath = path.join(path.dirname(file.path), value)
        const dependency = graph.nodes[`File:::${absolutePath}.ts`] || graph.nodes[`File:::${absolutePath}.tsx`] || graph.nodes[`File:::${absolutePath}`]

        if (dependency) {
          addEdge(graph, [file.id, 'importsFile', dependency.id])
        }
      }
      else {
        addEdge(graph, [file.id, 'importsModule', `Module:::${value}`])
      }
    }
  })

  /* ---
  FUNCTIONS
  --- */

  const createFunctionId = (name: string) => `Function:::${filePath}:::${name}`

  traverse(file.ast, {
    FunctionDeclaration(path) {
      const functionNode: FunctionType = {
        id: createFunctionId(path.node.id.name),
        type: 'Function',
        name: path.node.id.name,
        isComponent: false,
        exportType: 'none',
        astPath: path,
      }

      let isWithinReturnStatement = false

      traverse(path.node, {
        ReturnStatement() {
          isWithinReturnStatement = true
        },
        JSXElement(path) {
          if (isWithinReturnStatement) {
            functionNode.isComponent = true

            path.stop()
          }
        },
      }, path.scope, path)

      addNode(graph, functionNode)
      addEdge(graph, [file.id, 'declaresFunction', functionNode.id])
    },
  })

  /* ---
    EXPORTS
  --- */

  traverse(file.ast, {
    ExportDeclaration(path) {
      const { type, declaration } = path.node as any
      let name

      switch (declaration.type) {
        case 'FunctionDeclaration': {
          name = declaration.id.name
          break
        }
        case 'Identifier': {
          name = declaration.name
          break
        }
        default: {
          // FIXME
          throw new Error(`Unsupported export type: ${declaration.type}`)
        }
      }

      const fn = graph.nodes[createFunctionId(name)] as FunctionType

      if (fn) {
        fn.exportType = type === 'ExportDefaultDeclaration' ? 'default' : 'named'
      }
    },
  })

  return file
}

export default addFile
