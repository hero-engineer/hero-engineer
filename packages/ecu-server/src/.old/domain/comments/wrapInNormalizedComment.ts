function wrapInNormalizedComments(code: string) {
  return `/*
${code}
*/`
}

export default wrapInNormalizedComments
