import { CssValuesType } from '@types'

function areCssValuesEqual(a: CssValuesType, b: CssValuesType) {
  const aEntries = Object.entries(a)
  const bEntries = Object.entries(b)

  if (aEntries.length !== bEntries.length) return false

  return aEntries.every(([key, value]) => b[key] === value)
}

export default areCssValuesEqual
