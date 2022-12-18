import { useMemo } from 'react'
import { Div } from 'honorable'

import { refetchKeys } from '~constants'

import { FilePathsQuery, FilePathsQueryDataType } from '~queries'

import useQuery from '~hooks/useQuery'
import useRefetch from '~hooks/useRefetch'

import { convertToEcuComponentPath } from '~utils/convertComponentPath'

import TabLink from '~components/layout/TabLink'

type FilesTreePropsType = {
  filter?: (relativePath: string) => boolean
}

const lookup = 'app/src/'

function extractRelativePath(path: string) {
  const index = path.indexOf(lookup)

  return index === -1 ? path : path.slice(index + lookup.length)
}

function FilesTree({ filter }: FilesTreePropsType) {
  const [filePathsQueryResult, refetchFilePathsQuery] = useQuery<FilePathsQueryDataType>({
    query: FilePathsQuery,
  })

  useRefetch({
    key: refetchKeys.filePaths,
    refetch: refetchFilePathsQuery,
  })

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
