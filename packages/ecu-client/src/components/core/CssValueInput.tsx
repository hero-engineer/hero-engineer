import { useCallback, useMemo, useState } from 'react'
import { Div, Input, Menu, MenuItem, WithOutsideClick } from 'honorable'
import { AiOutlineFunction } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'

import { cssValueUnits } from '../../constants'

import splitSpacingValue from '../../utils/splitSpacingValue'
import trimLeadingZeroes from '../../utils/trimLeadingZeroes'

type CssValueInputPropsType = {
  value: string
  onChange: (value: string) => void
  allowInherit?: boolean
  large?: boolean
}

const validationRegex = /^auto|inherit|[0-9-+*%/\s]+(?:px|%|rem|em|vw|vh|vmin|vmax|ch|ex|mm|cm|in|pt|pc|svh|lvh|dvh)*$/

function CssValueInput({ value, onChange, allowInherit = false, large }: CssValueInputPropsType) {
  const [rawValue, unit = allowInherit ? 'inherit' : 'auto'] = splitSpacingValue(value)

  const isError = useMemo(() => !validationRegex.test(value), [value])

  console.log('isError', rawValue, isError)

  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false)

  const handleUnitClick = useCallback((nextUnit: string) => {
    setIsUnitMenuOpen(false)
    onChange(nextUnit === 'auto' ? nextUnit : `${unit === 'auto' ? 0 : rawValue}${nextUnit}`)
  }, [onChange, rawValue, unit])

  const handleInputChange = useCallback((event: any) => {
    const nextValue = event.target.value === '0' ? event.target.value : trimLeadingZeroes(event.target.value)
    const nextUnit = (unit === 'auto' || unit === 'inherit') && nextValue ? 'px' : unit

    onChange(`${nextValue}${nextUnit}`)
  }, [onChange, unit])

  const handleInputEvalutate = useCallback(() => {
    let workingValue = rawValue
    let nextUnit = unit

    if (workingValue === 'inherit') {
      onChange('inherit')

      return
    }
    if (workingValue === 'auto') {
      onChange('auto')

      return
    }

    const foundUnitAtValueEnd = cssValueUnits.find(unit => workingValue.endsWith(unit))

    if (foundUnitAtValueEnd) {
      nextUnit = foundUnitAtValueEnd
      workingValue = workingValue.slice(0, -foundUnitAtValueEnd.length)
    }

    try {
      // Evaluate complex expressions
      // eslint-disable-next-line no-eval
      workingValue = eval(workingValue)
    }
    catch (error) {
      //
    }

    onChange(`${workingValue}${nextUnit}`)
  }, [rawValue, unit, onChange])

  const handleMenuClose = useCallback(() => {
    setIsUnitMenuOpen(false)
  }, [])

  const renderAdornment = useCallback(() => (
    <Div
      xflex="x4"
      alignSelf="stretch"
      backgroundColor="background-light"
      color={isError ? 'error' : 'inherit'}
      borderLeft="1px solid border"
      cursor="pointer"
      onClick={() => !isError && setIsUnitMenuOpen(x => !x)}
      py={0.25 / 2}
      px={0.25}
    >
      {isError ? <BiError /> : unit !== 'function' ? unit : <AiOutlineFunction />}
    </Div>
  ), [isError, unit])

  const renderUnitMenu = useCallback(() => (
    <WithOutsideClick
      preventFirstFire
      onOutsideClick={handleMenuClose}
    >
      <Menu
        id="CssValueInput-unit-menu" // See SpacingEditor
        position="absolute"
        bottom="calc(100% + 4px)"
        right={0}
        left={0}
        maxHeight={190}
        overflowY="auto"
      >
        {allowInherit && (
          <MenuItem
            slim
            noFocus // Would move the menu scroll otherwise
            onClick={() => handleUnitClick('inherit')}
          >
            inherit
          </MenuItem>
        )}
        {cssValueUnits.map(unit => (
          <MenuItem
            key={unit}
            slim
            noFocus // Would move the menu scroll otherwise
            onClick={() => handleUnitClick(unit)}
          >
            {unit !== 'function' ? unit : <AiOutlineFunction />}
          </MenuItem>
        ))}
      </Menu>
    </WithOutsideClick>
  ), [allowInherit, handleUnitClick, handleMenuClose])

  return (
    <Div
      xflex="x4"
      position="relative"
      lineHeight="100%"
    >
      <Input
        slim
        short={!large}
        disabledNoBackground
        noEndIconPadding
        value={rawValue}
        onChange={handleInputChange}
        onEnter={handleInputEvalutate}
        backgroundColor="background"
        endIcon={renderAdornment()}
        width={large ? 128 - 32 : undefined}
        overflow="hidden"
        pr={0}
      />
      {isUnitMenuOpen && renderUnitMenu()}
    </Div>
  )
}

export default CssValueInput
