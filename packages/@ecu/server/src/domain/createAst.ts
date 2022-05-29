import ts from 'typescript'

// https://smack0007.github.io/blog/2021/convert-typescript-ast-to-json.html
function createAst(code: string) {
  const sourceFile = ts.createSourceFile('code.ts', code, ts.ScriptTarget.Latest)

  let nextId = 0

  function addId(node: any) {
    nextId++
    node.id = nextId
    ts.forEachChild(node, addId)
  }

  addId(sourceFile)

  // No need to save the source again.
  delete sourceFile.text

  const cache: object[] = []

  return JSON.stringify(sourceFile, (key, value) => {
    // Discard the following.
    if (key === 'flags' || key === 'transformFlags' || key === 'modifierFlagsCache') {
      return
    }

    // Replace 'kind' with the string representation.
    if (key === 'kind') {
      value = ts.SyntaxKind[value]
    }

    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return

      cache.push(value)
    }

    return value
  })
}

export default createAst
