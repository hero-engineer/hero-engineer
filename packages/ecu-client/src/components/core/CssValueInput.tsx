import { Input } from 'honorable'

import splitCssValue from '../../utils/splitCssValue'

type CssValueInputPropsType = {
  value: string;
  onChange: (value: string) => void;
}

function CssValueInput({ value, onChange }: CssValueInputPropsType) {
  const [rawValue, unit = 'auto'] = splitCssValue(value)

  return (
    <Input
      slim
      short
      type="number"
      value={rawValue === 'auto' ? '' : rawValue}
      onChange={event => onChange(`${event.target.value}${unit?.toString()}`)}
      backgroundColor="white"
    />
  )
}

export default CssValueInput
