import { CssValueType } from '~types'

const cssImportantString = '!important'

export function extractCssImportant<T extends CssValueType>(value: T): [T, boolean] {
  if (typeof value === 'number') return [value, false]

  const isImportant = value.endsWith(cssImportantString)
  const workingValue = (isImportant ? value.slice(0, -cssImportantString.length) : (value as string)).trim() // Weird "as string" TS bug

  return [workingValue, isImportant] as [T, boolean]
}

export function removeCssImportant<T extends CssValueType>(value: T): T {
  return extractCssImportant(value)[0]
}

export function appendCssImportantToString(string: string, isImportant: boolean) {
  return isImportant ? string + cssImportantString : string
}

export function appendCssImportantToObject(object: Record<string, string>, isImportant: boolean) {
  if (!isImportant) return object

  Object.keys(object).forEach(key => {
    object[key] += cssImportantString
  })

  return object
}
