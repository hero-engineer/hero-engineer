import { TransformOptions } from '@babel/core'
import Babel from '@babel/standalone'
// @ts-expect-error
import babelPresetTypescript from '@babel/preset-typescript'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
import postcss from 'postcss'
import posscssNested from 'postcss-nested'

export { default as Babel } from '@babel/standalone'

Babel.disableScriptTags()
Babel.registerPresets({
  typescript: babelPresetTypescript,
  react: babelPresetReact,
})

export const babelOptions: TransformOptions = {
  presets: ['typescript', 'react'],
  ast: true,
  generatorOpts: {
    jsescOption: {
      minimal: true, // To prevent escaping unicode characters
    },
  },
}

export const Postcss = postcss([posscssNested])

export const allowedBabelExtensions = [
  'js',
  'jsx',
  'ts',
  'tsx',
]

export const allowedPostcssExtensions = [
  'css',
]
