import { useCallback, useState } from 'react'
import { Div, Input, Menu, MenuItem, WithOutsideClick } from 'honorable'

import { cssValueUnits } from '../../constants'

import splitSpacingValue from '../../utils/splitSpacingValue'
import trimLeadingZeroes from '../../utils/trimLeadingZeroes'

type CssValueInputPropsType = {
  value: string
  onChange: (value: string) => void
}

function CssValueInput({ value, onChange }: CssValueInputPropsType) {
  const [rawValue, unit = 'auto'] = splitSpacingValue(value)

  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false)

  const handleUnitClick = useCallback((nextUnit: string) => {
    setIsUnitMenuOpen(false)
    onChange(nextUnit === 'auto' ? nextUnit : `${unit === 'auto' ? 0 : rawValue}${nextUnit}`)
  }, [onChange, rawValue, unit])

  const handleInputChange = useCallback((event: any) => {
    onChange(`${event.target.value === '0' ? event.target.value : trimLeadingZeroes(event.target.value)}${unit?.toString()}`)
  }, [onChange, unit])

  const handleMenuClose = useCallback(() => {
    setIsUnitMenuOpen(false)
  }, [])

  const renderAdornment = useCallback(() => (
    <Div
      py={0.25 / 2}
      px={0.25}
      backgroundColor="background-light"
      borderLeft="1px solid border"
      cursor="pointer"
      onClick={() => setIsUnitMenuOpen(x => !x)}
    >
      {unit}
    </Div>
  ), [unit])

  const renderUnitMenu = useCallback(() => (
    <WithOutsideClick
      preventFirstFire
      onOutsideClick={handleMenuClose}
    >
      <Menu
        id="CssValueInput-unit-menu"
        position="absolute"
        bottom="calc(100% + 4px)"
        right={0}
        left={0}
        maxHeight={190}
        overflowY="auto"
      >
        {cssValueUnits.map(unit => (
          <MenuItem
            key={unit}
            slim
            noFocus // Would move the menu scroll otherwise
            onClick={() => handleUnitClick(unit)}
          >
            {unit}
          </MenuItem>
        ))}
      </Menu>
    </WithOutsideClick>
  ), [handleUnitClick, handleMenuClose])

  return (
    <Div
      xflex="x4"
      position="relative"
    >
      <Input
        slim
        short
        type="number"
        value={rawValue === 'auto' ? '' : rawValue}
        onChange={handleInputChange}
        backgroundColor="background"
        endIcon={renderAdornment()}
        disabled={unit === 'auto'}
        overflow="hidden"
        pr={0}
      />
      {isUnitMenuOpen && renderUnitMenu()}
    </Div>
  )
}

export default CssValueInput
