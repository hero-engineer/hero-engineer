import { TypefaceType } from '~types'

const googleFontsRegex = /family=[a-zA-Z+]+:wght@[0-9;.]+/g

function extractTypefacesFromUrl(typefaceUrl: string) {
  if (!typefaceUrl) return { isError: false, typefaces: [] }

  const match = typefaceUrl.match(googleFontsRegex)

  if (!match) return { isError: true, typefaces: [] }

  try {
    const typefaces: TypefaceType[] = []

    match.forEach(m => {
      const [rawName, rawWeights] = m.split(':wght@')

      const name = rawName.replaceAll('family=', '').replaceAll('+', ' ')
      const weights: number[] = []
      const isVariable = rawWeights.includes('..')

      if (isVariable) {
        const [start, end] = rawWeights.split('..').map(w => parseInt(w))

        for (let i = start; i <= end; i += 100) {
          weights.push(i)
        }
      }
      else {
        weights.push(...rawWeights.split(';').map(w => parseInt(w)))
      }

      typefaces.push({
        name,
        weights,
        isVariable,
        url: `https://fonts.googleapis.com/css2?${m}&display=swap`,
      })
    })

    return { isError: false, typefaces }
  }
  catch (error) {
    console.error(error)

    return { isError: true, typefaces: [] }
  }
}

export default extractTypefacesFromUrl
