import { CssClassType } from '@types'

import extractClassNamesFromSelector from './extractClassNamesFromSelector'

function filterClassesByClassNamesAndMedias(classes: CssClassType[], targetClassNames: string[], medias: string[]) {
  return classes
  .filter(cssClass => {
    if (!medias.includes(cssClass.media)) return false

    const classNames = extractClassNamesFromSelector(cssClass.selector)

    return classNames.every(className => targetClassNames.includes(className))
  })
  .sort((a, b) => medias.indexOf(a.media) - medias.indexOf(b.media)) // Sorting here is important
  // Classes come in the natural order (the no media one first then the others DESC media value)
  // We want them in the breakpoint order (no media then increasing abs(media))
}

export default filterClassesByClassNamesAndMedias
