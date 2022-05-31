import path from 'path'

import { ExpressionStatement, FunctionDeclaration, JSXElement, JSXIdentifier } from '@babel/types'
import { ParserOptions, parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import generate, { GeneratorOptions } from '@babel/generator'

import configuration from '../configuration'

import { UpdateHierarchyAstResolverType, updateHierarchyAst } from './updateHierarchyTree'
import { getFileAst, getFileLocation, parseJsx, regenerateFile } from './helpers'

async function insertComponentInHierarchy(
  fileName: string,
  componentName: string,
  insertedComponentFileName: string,
  insertedComponentName: string,
  index: string
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

  let returnStatementAst

  traverse(
    componentFunctionAstPath.node,
    {
      ReturnStatement(path) {
        returnStatementAst = path.node

        // TODO pick the correct return statement
        path.stop()
      },
    },
    componentFunctionAstPath.scope,
    componentFunctionAstPath
  )

  if (!returnStatementAst) {
    throw new Error(`${componentName} in ${fileName} has no return statement`)
  }

  const resolver: UpdateHierarchyAstResolverType = path => {
    path.node.children.push(parseJsx(`<${insertedComponentName} />`))
  }

  updateHierarchyAst(returnStatementAst, resolver, true, index)

  regenerateFile(fileAst.program, fileLocation)
}

// async function insertImportStatement(AppSource: SourceFile, name: string) {
//   for (const xImport of AppSource.getImportDeclarations()) {
//     const names = [xImport.getDefaultImport(), ...xImport.getNamedImports()]
//       .filter(x => x)
//       .map(x => x.getText())

//     if (names.indexOf(name) !== -1) {
//       return
//     }
//   }

//   const comments = AppSource.getStatementsWithComments()

//   if (comments.length === 0) {
//     throw new Error('No ecu comments found in App.tsx')
//   }

//   comments.forEach(comment => {
//     if (comment.getText().includes('ecu-imports')) {
//       AppSource.insertImportDeclaration(comment.getChildIndex() + 1, {
//         defaultImport: name,
//         moduleSpecifier: `./components/${name}`,
//       })
//     }
//   })
// }

insertComponentInHierarchy('App', 'App', 'components/Cool', 'Cool', '0.0')

export default insertComponentInHierarchy
