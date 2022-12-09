import { File } from '@babel/types'
import { PluginObj, TransformOptions, Visitor } from '@babel/core'
import Babel from '@babel/standalone'
// import babelPresetEnv from '@babel/preset-env'
// @ts-expect-error
import babelPresetTypescript from '@babel/preset-typescript'
// import babelPluginJsx from '@babel/plugin-syntax-jsx'
import postcss from 'postcss'
import posscssNested from 'postcss-nested'
// import nodePath from 'path-browserify'

import { AstsType, HierarchiesType } from '~types'

export { default as Babel } from '@babel/standalone'

// TODO move processors js files to the server and load then async
// What about types?

Babel.registerPreset('typescript', babelPresetTypescript)
// Babel.registerPlugin('jsx', babelPluginJsx)

export const Postcss = postcss([posscssNested])

export const allowedPostcssExtensions = ['css']

export const allowedBabelExtensions = ['js', 'jsx', 'ts', 'tsx']

export const forbiddedBabelExtensions = ['d.ts']

export const babelOptions: TransformOptions = {
  presets: [
    [
      'typescript',
      {
        isTSX: true,
        allExtensions: true,
      },
    ],
  ],
  // plugins: ['jsx'],
  ast: true,
  code: false,
  generatorOpts: {
    jsescOption: {
      minimal: true, // To prevent escaping unicode characters
    },
  },
}

const hierarchyBabelOptions: TransformOptions = {
  ast: false,
  code: false,
}

const allowedFunctionComponentFirstCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

type ImportType = {
  type: 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier'
  source: string
  name: string
}

type ExportType = {
  type: 'ExportNamedDeclaration' | 'ExportDefaultDeclaration'
  name: string
}

export function createHierarchies(asts: AstsType, path: string, componentElements: HTMLElement[]) {
  if (!asts[path]?.ast) return

  const hierarchies: HierarchiesType = {}
  const imports: ImportType[] = []
  const exports: ExportType[] = []

  function visitFunctionComponent(functionName: string, functionBodyStart: number): Visitor {
    const isDefaultExport = exports.find(e => e.name === functionName)?.type === 'ExportDefaultDeclaration'

    console.log('visitFunctionComponent', functionName, isDefaultExport)

    return {
      ReturnStatement(path) {
        // If we're on the return statement of the function
        if (path.parent.start !== functionBodyStart) return path.skip()

        path.traverse(visitJsx(functionName, path.node.start!))
        path.skip()
      },
    }
  }

  function visitJsx(functionName: string, parentStart: number): Visitor {
    return {
      JSXFragment(path) {
        if (path.parent.start !== parentStart) return path.skip()

        path.traverse(visitJsx(functionName, path.node.start!))
        path.skip()
      },
      JSXElement(path) {
        if (path.parent.start !== parentStart) return path.skip()

        if (path.node.openingElement.name.type === 'JSXIdentifier') {
          console.log('jsx', functionName, path.node.openingElement.name.name)
        }
        if (path.node.openingElement.name.type === 'JSXMemberExpression') {
          console.log('jsx member', functionName, path.node.openingElement.name.object.name)
        }
      },
    }
  }

  function hierarchyImportsPlugin(): PluginObj {
    console.log('hierarchyImportsPlugin')

    return {
      visitor: {
        ImportDeclaration(path) {
          imports.push(...path.node.specifiers.map(specifier => ({
            source: path.node.source.value,
            type: specifier.type,
            name: specifier.local.name,
          })))
        },
        ExportNamedDeclaration(path) {
          exports.push(...path.node.specifiers.map(specifier => ({
            type: path.node.type,
            name: specifier.exported.type === 'Identifier' ? specifier.exported.name : specifier.exported.value,
          })))
        },
        ExportDefaultDeclaration(path) {
          console.log('ExportDefaultDeclaration', path.node.declaration)
          exports.push({
            type: path.node.type,
            // @ts-expect-error
            name: path.node.declaration?.id ?? path.node.declaration?.name?.name ?? path.node.declaration?.name ?? '',
          })
        },
      },
    }
  }

  function hierarchyPlugin(): PluginObj {
    console.log('hierarchyPlugin')

    return {
      visitor: {
        FunctionDeclaration(path) {
          // Look for Component functions
          if (!(path.parent.type === 'Program' && path.node.id && allowedFunctionComponentFirstCharacters.includes(path.node.id.name[0]))) return path.skip()

          path.traverse(visitFunctionComponent(path.node.id.name, path.node.body.start!))
          path.skip()
        },
      },
    }
  }

  Babel.registerPlugins({
    'ecu-hierarchy-imports': hierarchyImportsPlugin,
    'ecu-hierarchy': hierarchyPlugin,
  })

  Babel.transformFromAst(asts[path].ast as File, asts[path].code, { ...hierarchyBabelOptions, filename: path, plugins: ['ecu-hierarchy-imports'] })
  Babel.transformFromAst(asts[path].ast as File, asts[path].code, { ...hierarchyBabelOptions, filename: path, plugins: ['ecu-hierarchy'] })

  console.log('imports', imports)
  console.log('exports', exports)
  console.log('end')

  return hierarchies
}