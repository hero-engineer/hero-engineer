/* eslint-disable no-restricted-globals */
import { File } from '@babel/types'
import { Document, Root } from 'postcss'

import { AstsType, FileType } from '~types'

import { Babel, postcss, allowedBabelExtensions, allowedCssExtensions, babelOptions, forbiddedBabelExtensions } from 'processors/typescript'

self.onmessage = e => {
  const message = JSON.parse(e.data)

  console.log('message', message)

  if (!message.type) return

  if (message.type === 'asts') {
    generateAsts(message.data as FileType[])
  }
}

async function generateAsts(files: FileType[]) {
  const astPromises = files.reduce<Promise<File | Root | Document | null | undefined>[]>((promises, { path, code }) => [
    ...promises,
    !forbiddedBabelExtensions.some(extension => path.endsWith(extension)) && allowedBabelExtensions.some(extension => path.endsWith(extension))
      ? Promise.resolve(Babel.transform(code, { ...babelOptions, filename: path }).ast)
      : allowedCssExtensions.some(extension => path.endsWith(extension))
        ? postcss.process(code, { from: path }).then(x => x.root)
        : Promise.resolve(null),
  ], [])

  const astsArray = await Promise.all(astPromises)

  const data = files.reduce<AstsType>((asts, { path, code }, i) => ({
    ...asts,
    [path]: {
      code,
      ast: astsArray[i],
    },
  }), {})

  console.log('data', data)

  self.postMessage(JSON.stringify({
    type: 'asts',
    data,
  }))
}

export {}
