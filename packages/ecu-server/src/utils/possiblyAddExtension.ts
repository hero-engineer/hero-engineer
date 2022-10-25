function possiblyAddExtension(string: string, isJsx = true) {
  if (string.endsWith('.ts') || string.endsWith('.tsx')) {
    return string
  }

  return isJsx ? `${string}.tsx` : `${string}.ts`
}

export default possiblyAddExtension
