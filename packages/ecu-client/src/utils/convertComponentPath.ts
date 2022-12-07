export function convertToEcuComponentPath(path: string) {
  const pathArray = path.split('.')

  const extension = pathArray.pop()

  return `${pathArray.join('.')}/${extension}`
}

export function convertFromEcuComponentPath(ecuPath: string) {
  const pathArray = ecuPath.split('/')

  const extension = pathArray.pop()

  return `${pathArray.join('/')}.${extension}`
}
