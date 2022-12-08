import { useMemo } from 'react'
import { Div } from 'honorable'

import { FilePathsQuery, FilePathsQueryDataType } from '~queries'

import useQuery from '~hooks/useQuery'

import { convertToEcuComponentPath } from '~utils/convertComponentPath'

import TabLink from '~core/full-ast/TabLink'

const lookup = 'app/src/'

function extractRelativePath(path: string) {
  const index = path.indexOf(lookup)

  return index === -1 ? path : path.slice(index + lookup.length)
}

function FilesTree() {
  const [filePathsQueryResult] = useQuery<FilePathsQueryDataType>({
    query: FilePathsQuery,
  })

  // TODO useRefetch

  const paths = useMemo(() => filePathsQueryResult.data?.filePaths ?? [], [filePathsQueryResult.data])

  return (
    <Div>
      {paths.map(path => {
        const relativePath = extractRelativePath(path)

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
