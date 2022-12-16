import { useMemo } from 'react'
import { Div } from 'honorable'

import TabLink from '~components/layout/TabLink'

import { FilePathsQuery, FilePathsQueryDataType } from '~queries'

import useQuery from '~hooks/useQuery'

import { convertToEcuComponentPath } from '~utils/convertComponentPath'

type FilesTreePropsType = {
  filter?: (relativePath: string) => boolean
}

const lookup = 'app/src/'

function extractRelativePath(path: string) {
  const index = path.indexOf(lookup)

  return index === -1 ? path : path.slice(index + lookup.length)
}

function FilesTree({ filter }: FilesTreePropsType) {
  const [filePathsQueryResult] = useQuery<FilePathsQueryDataType>({
    query: FilePathsQuery,
  })

  // TODO useRefetch

  const paths = useMemo(() => filePathsQueryResult.data?.filePaths ?? [], [filePathsQueryResult.data])

  return (
    <Div>
      {paths.map(path => {
        const relativePath = extractRelativePath(path)

        if (typeof filter === 'function' && !filter(relativePath)) return null

        return (
          <Div key={relativePath}>
            <TabLink
              to={`/_ecu_/~/${convertToEcuComponentPath(relativePath)}`}
              label={relativePath.split('/').pop() ?? '?'}
            >
              {relativePath}
            </TabLink>
          </Div>
        )
      })}
    </Div>
  )
}

export default FilesTree
