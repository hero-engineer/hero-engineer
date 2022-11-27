import { KeyboardEvent, RefObject, useCallback, useState } from 'react'
import { Div, Input, Menu, MenuItem } from 'honorable'

import { cssValueUnits } from '../../constants'

import splitSpacingValue from '../../utils/splitSpacingValue'
import trimLeadingZeroes from '../../utils/trimLeadingZeroes'

type CssValueInputPropsType = {
  value: string
  onChange: (value: string) => void
  unitMenuRef: RefObject<any>
}

function CssValueInput({ value, onChange, unitMenuRef }: CssValueInputPropsType) {
  const [rawValue, unit = 'auto'] = splitSpacingValue(value)

  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false)

  const handleUnitClick = useCallback((nextUnit: string) => {
    setIsUnitMenuOpen(false)
    onChange(nextUnit === 'auto' ? nextUnit : `${unit === 'auto' ? 0 : rawValue}${nextUnit}`)
  }, [onChange, rawValue, unit])

  const handleInputChange = useCallback((event: any) => {
    onChange(`${event.target.value === '0' ? event.target.value : trimLeadingZeroes(event.target.value)}${unit?.toString()}`)
  }, [onChange, unit])

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
    <Menu
      ref={unitMenuRef}
      position="absolute"
      bottom="calc(100% + 4px)"
      right={0}
      left={0}
      maxHeight={190}
      overflowY="auto"
      display={isUnitMenuOpen ? 'block' : 'none'}
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
  ), [unitMenuRef, isUnitMenuOpen, handleUnitClick])

  return (
    <Div
      ref={unitMenuRef}
      xflex="x4"
      position="relative"
    >
      <Input
        slim
        short
        type="number"
        value={rawValue === 'auto' ? '' : rawValue}
        onChange={handleInputChange}
        backgroundColor="white"
        endIcon={renderAdornment()}
        disabled={unit === 'auto'}
        pr={0}
      />
      {renderUnitMenu()}
    </Div>
  )
}

export default CssValueInput
