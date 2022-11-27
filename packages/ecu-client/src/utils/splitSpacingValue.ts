import { cssValueUnits } from '../constants'

function splitSpacingValue(cssValue: string | number): [string, typeof cssValueUnits[number] | null] {
  if (typeof cssValue === 'number') return [cssValue.toString(), 'px']
  if (cssValue === 'auto') return [cssValue, 'auto']

  const unit = cssValueUnits.find(unit => cssValue.endsWith(unit))

  if (unit) return [cssValue.slice(0, -unit.length), unit]

  return [cssValue, 'px']
}

export default splitSpacingValue
