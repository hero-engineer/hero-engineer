import path from 'path'

import traverse from '@babel/traverse'
import shortId from 'shortid'

import { appPath } from '../../configuration'
import { FileNodeType } from '../../types'

import { addEdge, addNode, getNodesByRole } from '..'
import createFunctionNode from '../models/createFunctionNode'

function addFileDependencies(fileNode: FileNodeType) {
  const { ast } = fileNode.payload
  const fileNodes = getNodesByRole('File')

  /* ---
    IMPORTS
  --- */

  traverse(ast, {
    ImportDeclaration({ node }) {
      const { value } = node.source

      if (value.startsWith('.')) {
        const absolutePath = path.join(path.dirname(fileNode.payload.path), value)
        const relativePath = path.relative(appPath, absolutePath)
        const dependency = fileNodes.find(n => n.payload.relativePath === relativePath)

        if (dependency) {
          addEdge([fileNode.address, 'importsFile', dependency.address])
        }
      }
      else {
        addEdge([fileNode.address, 'importsModule', value])
      }
    },
  })

  /* ---
  FUNCTIONS
  --- */

  traverse(ast, {
    FunctionDeclaration(path) {
      const functionNode = createFunctionNode({
        address: shortId(),
        role: 'Function',
        state: null,
        payload: {
          name: path.node.id?.name || '',
          isComponent: false,
          path: fileNode.payload.path,
          relativePath: fileNode.payload.relativePath,
          exportType: 'none',
        },
      })

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

      addNode(functionNode)
      addEdge([fileNode.address, 'declaresFunction', functionNode.address])
    },
  })

  /* ---
    EXPORTS
  --- */

  traverse(ast, {
    ExportDeclaration(path) {
      const { type, declaration } = path.node as any
      let name: string

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
          console.log(fileNode.payload.relativePath, `Unsupported export type: ${declaration.type}`)

          return
        }
      }

      const functionNode = getNodesByRole('Function').find(n => n.payload.name === name && n.payload.path === fileNode.payload.path)

      if (functionNode) {
        functionNode.payload.exportType = type === 'ExportDefaultDeclaration' ? 'default' : 'named'
      }
    },
  })

  return fileNode
}

export default addFileDependencies
