export function convertToComponentPath(path: string) {
  if (!path) return path

  const pathArray = path.split('.')

  // Pop extension
  pathArray.pop()

  return encodeURI(`${pathArray.join('.')}`)
}

export function convertFromComponentPath(ecuPath: string) {
  if (!ecuPath) return ecuPath

  return `${decodeURI(ecuPath)}.tsx`
}
