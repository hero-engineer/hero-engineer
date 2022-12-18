function possiblyAddExtension(string: string, extension: string) {
  if (string.endsWith(extension)) {
    return string
  }

  return `${string}.${extension}`
}

export default possiblyAddExtension
