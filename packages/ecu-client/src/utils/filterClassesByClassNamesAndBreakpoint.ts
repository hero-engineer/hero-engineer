import { CssClassType } from '../types'

import extractClassNamesFromSelector from './extractClassNamesFromSelector'

function filterClassesByClassNamesAndBreakpoint(classes: CssClassType[], targetClassNames: string[], breakpointMaxValue: number | null) {
  return classes.filter(cssClass => {
    if (cssClass.breakpointMaxValue !== breakpointMaxValue) return false

    const classNames = extractClassNamesFromSelector(cssClass.selector)

    return classNames.every(className => targetClassNames.includes(className))
  })
}

export default filterClassesByClassNamesAndBreakpoint
