import { TypefaceType } from '~types'

import postCss, { cssReady, getIndexCss } from '~processors/css'

import extractTypefacesFromUrl from '~utils/extractTypefacesFromUrl'

const googleFontsRegex = /url\((.+)\)/

async function getTypefaces() {
  await cssReady.promise

  const { filePath, code } = getIndexCss()
  const { root } = postCss.process(code, { from: filePath })

  const typefaces: TypefaceType[] = []

  root.walkAtRules('import', rule => {
    const typefaceUrl = rule.params.match(googleFontsRegex)?.[1]

    if (!typefaceUrl) return

    const { isError, typefaces: nextTypefaces } = extractTypefacesFromUrl(typefaceUrl)

    if (isError) return

    typefaces.push(...nextTypefaces)
  })

  return typefaces
}

export default getTypefaces
