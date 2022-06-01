import { FunctionDeclaration } from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { UpdateHierarchyAstResolverType, updateHierarchyAst } from './updateHierarchyTree'
import { getFileAst, getFileLocation, parseJsx, regenerateFile } from './helpers'

async function insertComponentInHierarchy(
  fileName: string,
  componentName: string,
  insertedComponentFileName: string,
  insertedComponentName: string,
  index: string,
  position: 'before' | 'after',
) {

  const fileLocation = getFileLocation(fileName)
  const fileAst = getFileAst(fileLocation)

  let componentFunctionAstPath: NodePath<FunctionDeclaration>

  traverse(
    fileAst,
    {
      // ImportDeclaration(path) {

      // },
      FunctionDeclaration(path) {
        if (path.node.id.name === componentName) {
          componentFunctionAstPath = path

          path.stop()
        }
      },
    }
  )

  if (!componentFunctionAstPath) {
    throw new Error(`${componentName} not found in ${fileName}`)
  }

  let returnStatementAstPath

  traverse(
    componentFunctionAstPath.node,
    {
      ReturnStatement(path) {
        returnStatementAstPath = path

        // TODO pick the correct return statement
        path.stop()
      },
    },
    componentFunctionAstPath.scope,
    componentFunctionAstPath
  )

  if (!returnStatementAstPath) {
    throw new Error(`${componentName} in ${fileName} has no return statement`)
  }

  const resolver: UpdateHierarchyAstResolverType = (path, within) => {
    if (within) {
      path.node.children.push(parseJsx(`<${insertedComponentName} />`))
    }
    else if (position === 'before') {
      path.insertBefore(parseJsx(`<${insertedComponentName} />`))
    }
    else {
      path.insertAfter(parseJsx(`<${insertedComponentName} />`))
    }
  }

  updateHierarchyAst(returnStatementAstPath, resolver, index)

  await regenerateFile(fileAst.program, fileLocation)
}

// insertComponentInHierarchy('App', 'App', 'components/Cool', 'Cool', '0.0.0', 'before')

export default insertComponentInHierarchy
