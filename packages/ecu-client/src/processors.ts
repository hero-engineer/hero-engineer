import { File } from '@babel/types'
import { PluginObj, TransformOptions, Visitor } from '@babel/core'
import Babel from '@babel/standalone'
// import babelPresetEnv from '@babel/preset-env'
// @ts-expect-error
import babelPresetTypescript from '@babel/preset-typescript'
// @ts-expect-error
import babelPluginJsx from '@babel/plugin-syntax-jsx'
import postcss from 'postcss'
import posscssNested from 'postcss-nested'
// import nodePath from 'path-browserify'

import { AstsType, HierarchiesType, HierarchyType } from '~types'

export { default as Babel } from '@babel/standalone'

// TODO move processors js files to the server and load then async
// What about types?

Babel.registerPreset('typescript', babelPresetTypescript)
Babel.registerPlugin('jsx', babelPluginJsx)

export const babelOptions: TransformOptions = {
  presets: ['env', 'typescript'],
  plugins: ['jsx'],
  ast: true,
  generatorOpts: {
    jsescOption: {
      minimal: true, // To prevent escaping unicode characters
    },
  },
}

const hierarchyBabelOptions: TransformOptions = {
  ...babelOptions,
  plugins: [...babelOptions.plugins!, 'ecu-hierarchy-imports', 'ecu-hierarchy'],
}

export const Postcss = postcss([posscssNested])

export const allowedBabelExtensions = [
  'js',
  'jsx',
  'ts',
  'tsx',
]

export const forbiddedBabelExtensions = [
  'd.ts',
]

export const allowedPostcssExtensions = [
  'css',
]

type ImportSpecifierType = {
  type: 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier'
  name: string
}

export async function createHierarchy(ast: File, path: string, componentElements: HTMLElement[], asts: AstsType, hierarchies: HierarchiesType) {
  const hierarchy: HierarchyType = {}
  const imports: Record<string, ImportSpecifierType[]> = {}

  function visitFunctionComponent(functionName: string, functionBodyStart: number): Visitor {
    return {
      ReturnStatement(path) {
        // If we're on the return statement of the function
        if (path.parent.start === functionBodyStart) {
          path.traverse(visitJsx(functionName))
        }
      },
    }
  }

  function visitJsx(functionName: string): Visitor {
    return {
      JSXOpeningElement(path) {
        console.log('visitJsx xxx', functionName, path.node.name)
      },
    }
  }

  function babelHierarchyImportsPlugin(): PluginObj {
    return {
      visitor: {
        ImportDeclaration(path) {
          if (!imports[path.node.source.value]) {
            imports[path.node.source.value] = []
          }

          imports[path.node.source.value].push(...path.node.specifiers.map(specifier => ({
            type: specifier.type,
            name: specifier.local.name,
          })))
        },
      },
    }
  }

  function babelHierarchyPlugin(): PluginObj {
    console.log('imports', imports)

    return {
      visitor: {
        FunctionDeclaration(path) {
          // Look for Component functions
          if (path.parent.type === 'Program' && path.node.id && path.node.id.name[0] === path.node.id.name[0].toUpperCase()) {
            path.traverse(visitFunctionComponent(path.node.id.name, path.node.body.start!))
          }
        },
      },
    }
  }

  Babel.registerPlugins({
    'ecu-hierarchy-imports': babelHierarchyImportsPlugin,
    'ecu-hierarchy': babelHierarchyPlugin,
  })

  await new Promise(resolve => {
    Babel.transformFromAst(ast, undefined, { ...hierarchyBabelOptions, filename: path }, resolve)
  })

  return hierarchy
}
