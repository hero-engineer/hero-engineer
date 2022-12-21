import { useContext } from 'react'
import { Div } from 'honorable'

import FilePathsContext from '~contexts/FilePathsContext'

import { convertToComponentPath } from '~utils/convertComponentPath'

import TabLink from '~components/layout/TabLink'

type FilesTreePropsType = {
  filter?: (filePath: string) => boolean
}

const lookup = '/src/'

function extractRelativePath(path: string) {
  const index = path.indexOf(lookup)

  return index === -1 ? path : path.slice(index + lookup.length)
}

function FilesTree({ filter }: FilesTreePropsType) {
  const filePaths = useContext(FilePathsContext)

  console.log('filePaths', filePaths)

  return (
    <Div>
      {filePaths.map(filePath => {
        if (typeof filter === 'function' && !filter(filePath)) return null

        const relativePath = extractRelativePath(filePath)

        return (
          <Div key={relativePath}>
            <TabLink
              to={`/_hero_/~/${convertToComponentPath(relativePath)}`}
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
