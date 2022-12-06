import '../../css/ColorPicker.css'

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
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

const prepareVariable = (color: ColorType) => `var(${color.variableName})`

function ColorPicker({ value, onChange, size = 16, pickerLeftOffset = 0, withOverlay = false, colors = [] }: ColorPickerPropsType) {
  const selectedColor = useMemo(() => colors.find(color => prepareVariable(color) === value), [colors, value])

  const [isOpen, setIsOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState(value === null ? '#ffffff' : selectedColor?.value ?? value)

  const handleSelectChange = useCallback((event: any) => {
    onChange(prepareVariable(event.target.value))
    setCurrentValue(event.target.value.value)
  }, [onChange])

  const handleOutsideClick = useCallback(() => {
    setIsOpen(false)

    if (selectedColor?.value === currentValue) return

    onChange(currentValue)
  }, [currentValue, selectedColor, onChange])

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

  useEffect(() => {
    if (!selectedColor) return

    setCurrentValue(selectedColor.value)
  }, [selectedColor])

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
            backgroundColor="background"
            className="ColorPicker-picker"
          >
            <ChromePicker
              color={currentValue}
              onChange={color => setCurrentValue(color.hex)}
            />
            {!!colors.length && (
              <Div
                xflex="y2s"
                gap={0.5}
                p={0.5}
              >
                <Div
                  fontSize="0.75rem"
                >
                  Design system colors:
                </Div>
                <Select
                  tiny
                  menuOnTop
                  width="100%"
                  value={selectedColor}
                  onChange={handleSelectChange}
                  placeholder="Select a color"
                >
                  {colors.map(color => (
                    <MenuItem
                      key={color.id}
                      value={color}
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
