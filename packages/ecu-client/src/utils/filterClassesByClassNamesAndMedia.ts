import extractClassNamesFromSelector from './extractClassNamesFromSelector'

import { CssClassType } from '@types'

function filterClassesByClassNamesAndMedia(classes: CssClassType[], targetClassNames: string[], media: string) {
  return classes.filter(cssClass => {
    if (cssClass.media !== media) return false

    const classNames = extractClassNamesFromSelector(cssClass.selector)

    return classNames.every(className => targetClassNames.includes(className))
  })
}

export default filterClassesByClassNamesAndMedia
