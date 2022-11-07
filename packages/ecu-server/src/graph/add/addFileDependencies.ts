import path from 'node:path'

import traverse from '@babel/traverse'
import shortId from 'shortid'

import { appPath } from '../../configuration'
import { FileNodeType, FunctionNodeType } from '../../types'

import { addEdge, addNode, getNodesByRole } from '..'
import createFunctionNode from '../models/createFunctionNode'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

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
        const relativePath = possiblyAddExtension(path.relative(appPath, path.join(path.dirname(fileNode.payload.path), value)), fileNode.payload.extension)
        const dependency = fileNodes.find(n => n.payload.relativePath === relativePath)

        if (dependency) {
          addEdge([fileNode.address, 'ImportsFile', dependency.address])
        }
      }
      else {
        addEdge([fileNode.address, 'ImportsModule', value])
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
          name: path.node.id?.name || '<anonymous>',
          isComponent: false,
          path: fileNode.payload.path,
          relativePath: fileNode.payload.relativePath,
          exportType: 'None',
        },
      })

      let isWithinReturnStatement = false

      path.traverse({
        ReturnStatement() {
          isWithinReturnStatement = true
        },
        JSXElement(path) {
          if (isWithinReturnStatement) {
            functionNode.payload.isComponent = true

            path.stop()
          }
        },
      })

      path.skip()

      addNode(functionNode)
      addEdge([fileNode.address, 'DeclaresFunction', functionNode.address])
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

      const functionNode = getNodesByRole<FunctionNodeType>('Function').find(n => n.payload.name === name && n.payload.path === fileNode.payload.path)

      if (functionNode) {
        functionNode.payload.exportType = type === 'ExportDefaultDeclaration' ? 'Default' : 'Named'
      }
    },
  })

  return fileNode
}

export default addFileDependencies
