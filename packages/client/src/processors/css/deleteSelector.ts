import { cssReady, getIndexCss, setIndexCss } from '~processors/css'
import getClasses from '~processors/css/getClasses'

async function deleteSelector(selector: string) {
  await cssReady.promise

  const { filePath, code } = getIndexCss()
  const classes = await getClasses()

  let nextCode = code

  const indexOfSelector = nextCode.indexOf(selector)

  if (indexOfSelector === -1) {
    throw new Error(`Selector ${selector} not found in index.css`)
  }

  const indexOfSelectorClass = classes.findIndex(c => c.selector === selector)

  if (indexOfSelectorClass === -1) {
    throw new Error(`Selector ${selector} not found in index.css classes`)
  }

  const indexOfNextSelectorClass = classes.findIndex((c, i) => i > indexOfSelectorClass && c.selector !== selector)

  // Assumes that the rest of index.css is empty
  if (indexOfNextSelectorClass === -1) {
    nextCode = nextCode.slice(0, indexOfSelector)
  }
  else {
    const nextSelectorClass = classes[indexOfNextSelectorClass]
    const indexOfNextSelector = nextCode.indexOf(nextSelectorClass.selector)

    if (indexOfNextSelector === -1) {
      throw new Error(`Selector ${nextSelectorClass.selector} not found in index.css`)
    }

    nextCode = nextCode.slice(0, indexOfSelector) + nextCode.slice(indexOfNextSelector)
  }

  setIndexCss(nextCode)

  return { code: nextCode, filePath }
}

export default deleteSelector
