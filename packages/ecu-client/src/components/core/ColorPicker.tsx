import { Div, WithOutsideClick } from 'honorable'
import { useCallback, useState } from 'react'
import { ChromePicker } from 'react-color'

import { zIndexes } from '../../constants'

type ColorPickerPropsType = {
  size?: number
  value: string
  onChange: (value: string) => void
}

function ColorPicker({ size = 16, value, onChange }: ColorPickerPropsType) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)

  const onOutsideClick = useCallback(() => {
    setIsOpen(false)
    onChange(currentValue)
  }, [currentValue, onChange])

  return (
    <Div
      position="relative"
      width={size}
      height={size}
      backgroundColor={value}
      cursor="pointer"
      onClick={() => setIsOpen(true)}
    >
      {isOpen && (
        <WithOutsideClick
          preventFirstFire
          onOutsideClick={onOutsideClick}
        >
          <Div
            position="absolute"
            bottom={0}
            left={0}
            zIndex={zIndexes.colorPicker + 1}
            userSelect="none"
          >
            <ChromePicker
              color={currentValue}
              onChange={color => setCurrentValue(color.hex)}
            />
          </Div>
        </WithOutsideClick>
      )}
    </Div>
  )
}

export default ColorPicker
