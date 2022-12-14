import postCss, { cssReady, getIndexCss } from '~processors/css'
import traverseCss from '~processors/css/traverseCss'

async function getClasses() {
  await cssReady.promise

  const { filePath, code } = getIndexCss()

  const { root } = postCss.process(code, { from: filePath })

  return traverseCss(root)
}

export default getClasses
