import { FileTreeType } from '~types'

function createFileTree(filePaths: string[]) {
  const tree: FileTreeType = {
    path: '',
    fullPath: '',
    children: [],
  }

  ;[...filePaths].sort().forEach(filePath => {
    let currentTree = tree
    let { fullPath } = currentTree

    filePath.split('/').forEach(pathPart => {
      const nextChild = currentTree.children.find(child => child.path === pathPart)

      fullPath += `${fullPath ? '/' : ''}${pathPart}`

      if (nextChild) {
        currentTree = nextChild
      }
      else {
        const nextChild: FileTreeType = {
          path: pathPart,
          fullPath,
          children: [],
        }
        currentTree.children.push(nextChild)

        currentTree = nextChild
      }
    })
  })

  return tree
}

export default createFileTree
