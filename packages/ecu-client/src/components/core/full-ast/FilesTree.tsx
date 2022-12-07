import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Div } from 'honorable'

import { FilesQuery, FilesQueryDataType } from '@queries'

import useQuery from '@hooks/useQuery'

import { convertToEcuComponentPath } from '@utils/convertComponentPath'

function FilesTree() {
  const [filesQueryResult] = useQuery<FilesQueryDataType>({
    query: FilesQuery,
  })

  // TODO useRefetch

  const files = useMemo(() => filesQueryResult.data?.files ?? [], [filesQueryResult.data])

  return (
    <Div>
      {files.map(file => (
        <Div key={file.path}>
          <Link to={`/_ecu_/~/${convertToEcuComponentPath(file.relativePath)}`}>
            {file.relativePath}
          </Link>
        </Div>
      ))}
    </Div>
  )
}

export default FilesTree
