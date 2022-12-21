export function convertToComponentPath(path: string) {
  if (!path) return path

  const pathArray = path.split('.')

  // Pop extension
  pathArray.pop()

  return encodeURIComponent(`${pathArray.join('.')}`)
}

export function convertFromComponentPath(ecuPath: string) {
  if (!ecuPath) return ecuPath

  return `${decodeURIComponent(ecuPath)}.tsx`
}
