import { CssClassType } from '../types'

import extractClassNamesFromSelector from './extractClassNamesFromSelector'

function filterClassesByClassNames(classes: CssClassType[], targetClassNames: string[]) {
  return classes.filter(cssClass => {
    const classNames = extractClassNamesFromSelector(cssClass.selector)

    return classNames.every(className => targetClassNames.includes(className))
  })
}

export default filterClassesByClassNames
