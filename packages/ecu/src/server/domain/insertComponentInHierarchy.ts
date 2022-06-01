import { FunctionDeclaration } from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { ComponentType, FileType } from '../../types'

import { UpdateHierarchyAstResolverType, updateHierarchyAst } from './updateHierarchyTree'
import generateComponentString from './generateComponentString'
import { getFileAst, parseJsx, regenerateFile } from './helpers'

function insertComponentInHierarchy(
  file: FileType,
  sourceComponent: ComponentType,
  targetComponent: ComponentType,
  index: string,
  position: 'before' | 'after',
) {
  const fileAst = getFileAst(file)

  let sourceComponentFunctionAstPath: NodePath<FunctionDeclaration>

  traverse(
    fileAst,
    {
      // ImportDeclaration(path) {

      // },
      FunctionDeclaration(path) {
        if (path.node.id.name === sourceComponent.name) {
          sourceComponentFunctionAstPath = path

          path.stop()
        }
      },
    }
  )

  if (!sourceComponentFunctionAstPath) {
    throw new Error(`${sourceComponent.name} not found in ${file.name}`)
  }

  let returnStatementAstPath

  traverse(
    sourceComponentFunctionAstPath.node,
    {
      ReturnStatement(path) {
        returnStatementAstPath = path

        // TODO pick the correct return statement
        path.stop()
      },
    },
    sourceComponentFunctionAstPath.scope,
    sourceComponentFunctionAstPath
  )

  if (!returnStatementAstPath) {
    throw new Error(`${sourceComponent.name} in ${file.name} has no return statement`)
  }

  const resolver: UpdateHierarchyAstResolverType = (path, within) => {
    const targetComponentAst = parseJsx(generateComponentString(targetComponent))

    if (within) {
      path.node.children.push(targetComponentAst)
    }
    else if (position === 'before') {
      path.insertBefore(targetComponentAst)
    }
    else {
      path.insertAfter(targetComponentAst)
    }
  }

  updateHierarchyAst(returnStatementAstPath, resolver, index)

  regenerateFile(fileAst.program, file)
}

export default insertComponentInHierarchy
