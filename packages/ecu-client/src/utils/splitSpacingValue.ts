import { CssValueType } from '~types'

import { cssValueUnits } from '~constants'

function splitSpacingValue(cssValue: CssValueType): [string, typeof cssValueUnits[number] | 'inherit'] {
  if (typeof cssValue === 'number') return [cssValue.toString(), 'px']

  const workingValue = cssValue.trim()

  if (workingValue === 'auto') return ['', 'auto']
  if (workingValue === 'inherit') return ['', 'inherit']

  const unit = cssValueUnits.find(unit => workingValue.endsWith(unit))

  if (unit) return [workingValue.slice(0, -unit.length), unit]

  return [workingValue, 'px']
}

export default splitSpacingValue
