import { TypefaceType } from '~types'

import postCss, { cssReady, getIndexCss, setIndexCss } from '~processors/css'

const typefaceUrlRegex = /url\((.+)\)/

async function setTypefaces(typefaces: TypefaceType[]) {
  await cssReady.promise

  const { filePath, code } = getIndexCss()
  const { root } = postCss.process(code, { from: filePath })

  root.walkAtRules('import', rule => {
    const typefaceUrl = rule.params.match(typefaceUrlRegex)?.[1]

    if (!typefaceUrl) return

    root.removeChild(rule)
  })

  // Preserve typefaces order
  ;[...typefaces].reverse().forEach(typeface => {
    root.prepend(`@import url('${typeface.url}');`)
  })

  const nextCode = root.toString()

  setIndexCss(nextCode)

  return {
    filePath,
    code: nextCode,
  }
}

export default setTypefaces
