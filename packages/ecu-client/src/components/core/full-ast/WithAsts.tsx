import { ReactNode, useCallback, useContext, useEffect } from 'react'
import { File } from '@babel/types'
import { Document, Root } from 'postcss'

import { AstsType } from '~types'

import { FilesQuery, FilesQueryDataType } from '~queries'

import { Babel, Postcss, allowedBabelExtensions, allowedPostcssExtensions, babelOptions, forbiddedBabelExtensions } from '~processors'

import AstsContext from '~contexts/AstsContext'

import useQuery from '~hooks/useQuery'

type WithAstsPropsType = {
  children: ReactNode
}

function WithAsts({ children }: WithAstsPropsType) {
  const { setAsts } = useContext(AstsContext)

  const [filesQueryResult] = useQuery<FilesQueryDataType>({ query: FilesQuery })

  // TODO useRefetch

  const computeHierarchy = useCallback((ast: File | null | undefined) => {

  }, [])

  const computeHierarchies = useCallback((asts: AstsType) => {
    const hierarchies: any = {}

    Object.entries(asts).forEach(([path, { ast }]) => {
      if (forbiddedBabelExtensions.some(extension => path.endsWith(extension)) || !allowedBabelExtensions.some(extension => path.endsWith(extension))) return

      hierarchies[path] = computeHierarchy(ast as File | null | undefined)
    })
  }, [computeHierarchy])

  const updateAstsContext = useCallback(async () => {
    if (!filesQueryResult.data?.files) return

    const astPromises = filesQueryResult.data.files
    .reduce<Promise<File | Root | Document | null | undefined>[]>((promises, { path, code }) => [
      ...promises,
      !forbiddedBabelExtensions.some(extension => path.endsWith(extension)) && allowedBabelExtensions.some(extension => path.endsWith(extension))
        ? Promise.resolve(Babel.transform(code, { ...babelOptions, filename: path }).ast)
        : allowedPostcssExtensions.some(extension => path.endsWith(extension))
          ? Postcss.process(code, { from: path }).then(x => x.root)
          : Promise.resolve(null),
    ], [])

    const astsArray = await Promise.all(astPromises)

    const asts = filesQueryResult.data.files.reduce<AstsType>((asts, { path, code }, i) => ({
      ...asts,
      [path]: {
        code,
        ast: astsArray[i],
      },
    }), {})

    setAsts(asts)
    computeHierarchies(asts)
  }, [filesQueryResult.data, setAsts, computeHierarchies])

  useEffect(() => {
    updateAstsContext()
  }, [updateAstsContext])

  return (
    <>
      {children}
    </>
  )
}

export default WithAsts
