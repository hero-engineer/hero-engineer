import { CssClassType } from '../types'

import extractClassNamesFromSelector from './extractClassNamesFromSelector'

function filterClassesByClassNamesAndMedia(classes: CssClassType[], targetClassNames: string[], media: string) {
  return classes.filter(cssClass => {
    if (cssClass.media !== media) return false

    const classNames = extractClassNamesFromSelector(cssClass.selector)

    return classNames.every(className => targetClassNames.includes(className))
  })
}

export default filterClassesByClassNamesAndMedia
