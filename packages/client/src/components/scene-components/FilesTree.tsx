import { useCallback, useContext, useMemo } from 'react'
import { Div, TreeView } from 'honorable'

import { FileTreeType } from '~types'

import FilePathsContext from '~contexts/FilePathsContext'

import { convertToComponentPath } from '~utils/convertComponentPath'
import createFileTree from '~utils/createFileTree'

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
  const fileTree = useMemo(() => createFileTree((typeof filter === 'function' ? filePaths.filter(filter) : filePaths).map(extractRelativePath)), [filePaths, filter])

  const renderFileTreeLabel = useCallback((fileTree: FileTreeType) => {
    if (!fileTree.path) return null
    if (!fileTree.path.endsWith('.tsx')) {
      return (
        <Div userSelect="none">
          {fileTree.path}
        </Div>
      )
    }

    const nameParts = fileTree.path.split('.')

    // Pop extension
    nameParts.pop()

    return (
      <TabLink
        to={`/_hero_/~/${convertToComponentPath(fileTree.fullPath)}`}
        label={nameParts.join('.')}
      >
        {fileTree.path}
      </TabLink>
    )
  }, [])

  const renderFileTree = useCallback((fileTree: FileTreeType, isRoot = false) => (
    <TreeView
      key={fileTree.path}
      defaultExpanded
      noBar={isRoot}
      label={renderFileTreeLabel(fileTree)}
    >
      {fileTree.children.map(child => renderFileTree(child))}
    </TreeView>
  ), [renderFileTreeLabel])

  return (
    <Div
      mt={-0.5}
      ml={-1}
    >
      {renderFileTree(fileTree, true)}
    </Div>
  )
}

export default FilesTree
