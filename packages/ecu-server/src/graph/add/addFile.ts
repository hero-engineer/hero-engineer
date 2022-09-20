import fs from 'fs'
import path from 'path'

import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import slugify from 'slugify'

import { FileType, FunctionType, GraphType, addEdge, addNode } from 'ecu-common'

import configuration from '../../configuration'

function addFile(graph: GraphType, filePath: string) {
  const relativePath = path.relative(configuration.appPath, filePath)
  const relativePathSlug = slugify(relativePath, { strict: true })
  const nameArray = path.basename(filePath).split('.')
  const extension = nameArray.pop()
  const name = nameArray.join('.')

  const file: FileType = {
    address: `File:::${relativePathSlug}`,
    role: 'File',
    state: null,
    payload: {
      name,
      extension,
      path: filePath,
      relativePath,
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
    },
  }

  addNode(graph, file)

  /* ---
    IMPORTS
  --- */

  file.payload.ast.program.body.forEach(node => {
    if (node.type === 'ImportDeclaration') {
      const { value } = node.source

      if (value.startsWith('.')) {
        const absolutePath = path.join(path.dirname(file.payload.path), value)
        const relativePathSlug = slugify(path.relative(configuration.appPath, absolutePath), { strict: true })
        const dependency = graph.nodes[`File:::${relativePathSlug}.tsx`] || graph.nodes[`File:::${relativePathSlug}.ts`] || graph.nodes[`File:::${relativePathSlug}`]

        if (dependency) {
          addEdge(graph, [file.address, 'importsFile', dependency.address])
        }
      }
      else {
        addEdge(graph, [file.address, 'importsModule', `Module:::${value}`])
      }
    }
  })

  /* ---
  FUNCTIONS
  --- */

  const createFunctionId = (name: string) => `Function:::${relativePathSlug}:::${name}`

  traverse(file.payload.ast, {
    FunctionDeclaration(path) {
      const functionNode: FunctionType = {
        address: createFunctionId(path.node.id.name),
        role: 'Function',
        state: null,
        payload: {
          name: path.node.id.name,
          isComponent: false,
          exportType: 'none',
          astPath: path,
        },
      }

      let isWithinReturnStatement = false

      traverse(path.node, {
        ReturnStatement() {
          isWithinReturnStatement = true
        },
        JSXElement(path) {
          if (isWithinReturnStatement) {
            functionNode.payload.isComponent = true

            path.stop()
          }
        },
      }, path.scope, path)

      addNode(graph, functionNode)
      addEdge(graph, [file.address, 'declaresFunction', functionNode.address])
    },
  })

  /* ---
    EXPORTS
  --- */

  traverse(file.payload.ast, {
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
          console.log(file.payload.relativePath, `Unsupported export type: ${declaration.type}`)
        }
      }

      const fn = graph.nodes[createFunctionId(name)] as FunctionType

      if (fn) {
        fn.payload.exportType = type === 'ExportDefaultDeclaration' ? 'default' : 'named'
      }
    },
  })

  return file
}

export default addFile
