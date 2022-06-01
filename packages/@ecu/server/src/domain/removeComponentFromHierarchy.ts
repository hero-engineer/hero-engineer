import { FunctionDeclaration } from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { UpdateHierarchyAstResolverType, updateHierarchyAst } from './updateHierarchyTree'
import { getFileAst, getFileLocation, regenerateFile } from './helpers'

async function removeComponentFromHierarchy(
  fileName: string,
  componentName: string,
  index: string,
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

  const resolver: UpdateHierarchyAstResolverType = path => {
    path.remove()
  }

  updateHierarchyAst(returnStatementAstPath, resolver, index)

  await regenerateFile(fileAst.program, fileLocation)
}

// removeComponentFromHierarchy('App', 'App', '0.0')

export default removeComponentFromHierarchy
