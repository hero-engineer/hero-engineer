import { ReactNode, useContext, useEffect } from 'react'
import Babel from '@babel/standalone'
// @ts-expect-error
import babelPresetTypescript from '@babel/preset-typescript'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
import { TransformOptions } from '@babel/core'

import { AstsType } from '@types'

import { FilesQuery, FilesQueryDataType } from '@queries'

import AstsContext from '@contexts/AstsContext'

import useQuery from '@hooks/useQuery'

Babel.disableScriptTags()
Babel.registerPresets({
  typescript: babelPresetTypescript,
  react: babelPresetReact,
})

const babelOptions: TransformOptions = {
  presets: ['typescript', 'react'],
  ast: true,
  generatorOpts: {
    jsescOption: {
      minimal: true, // To prevent escaping unicode characters
    },
  },
}

const allowedExtensions = [
  'js',
  'jsx',
  'ts',
  'tsx',
]

type WithAstsPropsType = {
  children: ReactNode
}

function WithAsts({ children }: WithAstsPropsType) {
  const { asts, setAsts } = useContext(AstsContext)

  const [filesQueryResult] = useQuery<FilesQueryDataType>({ query: FilesQuery })

  // TODO useRefetch

  useEffect(() => {
    if (!filesQueryResult.data?.files) return

    setAsts(
      filesQueryResult.data.files.reduce<AstsType>((asts, { path, code }) => ({
        ...asts,
        [path]: {
          ast: allowedExtensions.some(extension => path.endsWith(extension)) ? Babel.transform(code, { ...babelOptions, filename: path }).ast : null,
          code,
        },
      }), {})
    )
  }, [filesQueryResult.data, setAsts])

  console.log('asts', asts)

  return (
    <>
      {children}
    </>
  )
}

export default WithAsts
