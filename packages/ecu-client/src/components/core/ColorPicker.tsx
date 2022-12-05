import { ReactNode, useCallback, useState } from 'react'
import { Div, MenuItem, Select, WithOutsideClick } from 'honorable'
import { ChromePicker } from 'react-color'

import { ColorType } from '../../types'
import { zIndexes } from '../../constants'

type ColorPickerPropsType = {
  value: string | null
  onChange: (value: string) => void
  size?: number
  pickerLeftOffset?: number
  withOverlay?: boolean
  colors?: ColorType[]
}

function ColorPicker({ value, onChange, size = 16, pickerLeftOffset = 0, withOverlay = false, colors = [] }: ColorPickerPropsType) {
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
            backgroundColor="white"
          >
            <ChromePicker
              color={currentValue}
              onChange={color => setCurrentValue(color.hex)}
            />
            {!!colors.length && (
              <Div p={0.25}>
                <Select
                  menuOnTop
                  width="100%"
                  value={currentValue}
                  onChange={event => setCurrentValue(event.target.value)}
                  placeholder="Select a color"
                >
                  {colors.map(color => (
                    <MenuItem
                      key={color.id}
                      value={`var(${color.variableName})`}
                    >
                      <Div
                        xflex="x4"
                        gap={0.5}
                      >
                        <Div
                          width={12}
                          height={12}
                          backgroundColor={`var(${color.variableName})`}
                        />
                        {color.name}
                      </Div>
                    </MenuItem>
                  ))}
                </Select>
              </Div>
            )}
          </Div>
        )}
      </Div>
    </>
  )
}

export default ColorPicker
