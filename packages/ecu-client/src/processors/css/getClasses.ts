import postCss, { cssReady, getIndexCss } from '~processors/css'
import traverse from '~processors/css/traverse'

async function getClasses() {
  await cssReady.promise

  const { filePath, code } = getIndexCss()

  const { root } = postCss.process(code, { from: filePath })

  return traverse(root)
}

export default getClasses
