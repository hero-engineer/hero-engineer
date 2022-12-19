export function convertToComponentPath(path: string) {
  if (!path) return path

  const pathArray = path.split('.')

  const extension = pathArray.pop()

  return `${pathArray.join('.')}/${extension}`
}

export function convertFromComponentPath(ecuPath: string) {
  if (!ecuPath) return ecuPath

  const pathArray = ecuPath.split('/')

  const extension = pathArray.pop()

  return `${pathArray.join('/')}.${extension}`
}
