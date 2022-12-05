import { ReactNode, useCallback, useState } from 'react'
import { Div, WithOutsideClick } from 'honorable'
import { ChromePicker } from 'react-color'

import { zIndexes } from '../../constants'

type ColorPickerPropsType = {
  value: string | null
  onChange: (value: string) => void
  size?: number
  pickerLeftOffset?: number
  withOverlay?: boolean
}

function ColorPicker({ value, onChange, size = 16, pickerLeftOffset = 0, withOverlay = false }: ColorPickerPropsType) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState(value === null ? '#ffffff' : value)

  const handleOutsideClick = useCallback(() => {
    setIsOpen(false)
    onChange(currentValue)
  }, [currentValue, onChange])

  const wrapOutsideClick = useCallback((children: ReactNode) => {
    if (withOverlay) return children

    return (
      <WithOutsideClick
        preventFirstFire
        onOutsideClick={handleOutsideClick}
      >
        {children}
      </WithOutsideClick>
    )
  }, [withOverlay, handleOutsideClick])

  return (
    <>
      {withOverlay && isOpen && (
        <Div
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={zIndexes.colorPicker}
          onClick={handleOutsideClick}
        />
      )}
      <Div
        position="relative"
        width={size}
        height={size}
        backgroundColor={value === null ? 'white' : value}
        cursor="pointer"
        onClick={() => setIsOpen(true)}
      >
        {value === null && (
          <>
            <Div
              position="absolute"
              top={0}
              left={0}
              width={Math.floor(Math.sqrt(2 * size ** 2))}
              height={1}
              backgroundColor="danger"
              transformOrigin="left"
              transform="rotate(45deg)"
            />
            <Div
              position="absolute"
              bottom={0}
              left={0}
              width={Math.floor(Math.sqrt(2 * size ** 2))}
              height={1}
              backgroundColor="danger"
              transformOrigin="left"
              transform="rotate(-45deg)"
            />
          </>
        )}
        {isOpen && wrapOutsideClick(
          <Div
            position="absolute"
            bottom={0}
            left={pickerLeftOffset}
            zIndex={zIndexes.colorPicker + 1}
            userSelect="none"
          >
            <ChromePicker
              color={currentValue}
              onChange={color => setCurrentValue(color.hex)}
            />
          </Div>
        )}
      </Div>
    </>
  )
}

export default ColorPicker
