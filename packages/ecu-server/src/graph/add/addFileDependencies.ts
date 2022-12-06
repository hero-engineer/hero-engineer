import path from 'node:path'

import { NodePath } from '@babel/traverse'
import { FunctionDeclaration, addComment } from '@babel/types'
import shortId from 'shortid'

import { appPath, ecuFunctionIdCommentPrefix } from '../../configuration.js'
import { FileNodeType, FunctionNodeType } from '../../types.js'

import traverse from '../../domain/traverse.js'
import regenerate from '../../domain/regenerate.js'

import possiblyAddExtension from '../../utils/possiblyAddExtension.js'

import { addEdge, addNode, getNodesByRole } from '../index.js'

import createFunctionNode from '../models/createFunctionNode.js'

async function addFileDependencies(fileNode: FileNodeType) {
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

  let modified = false

  traverse(ast, {
    FunctionDeclaration(path) {
      let address = extractFunctionId(path)

      if (!address) {
        address = appendFunctionId(path)
        modified = true
      }

      const functionNode = createFunctionNode({
        address,
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

  /* ---
    REGENERATION
  --- */

  if (modified) await regenerate(fileNode, ast)

  return fileNode
}

function extractFunctionId(path: NodePath<FunctionDeclaration>) {
  const lastComment = path.node.leadingComments?.[path.node.leadingComments.length - 1]?.value
  const comment = ` ${ecuFunctionIdCommentPrefix} `

  return lastComment?.startsWith(comment) ? lastComment.slice(comment.length).trim() : ''
}

function appendFunctionId(path: NodePath<FunctionDeclaration>) {
  const id = shortId()
  const comment = `${ecuFunctionIdCommentPrefix} ${id}`

  addComment(path.node, 'leading', comment, true)

  return id
}

export default addFileDependencies
