import '../../../css/ColorPicker.css'

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Div, Input, MenuItem, Select, WithOutsideClick } from 'honorable'
import { ChromePicker } from 'react-color'

import { ColorType } from '~types'

import { zIndexes } from '~constants'

type ColorPickerPropsType = {
  noInput?: boolean
  value: string | null
  onChange: (value: string) => void
  size?: number
  pickerLeftOffset?: number
  withOverlay?: boolean
  colors?: ColorType[]
}

const prepareVariable = (color: ColorType) => `var(${color.variableName})`

function ColorPicker({
  value,
  onChange,
  noInput = false,
  size = 16,
  pickerLeftOffset = 0,
  withOverlay = false,
  colors = [],
}: ColorPickerPropsType) {
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

  const renderInputAdornment = useCallback(() => {
    const isNilValue = value === null || value === 'transparent'

    return (
      <Div
        position="relative"
        width={size}
        height={size}
        backgroundColor={isNilValue ? 'white' : value}
        cursor="pointer"
        borderRight={noInput ? null : '1px solid border'}
        onClick={() => setIsOpen(true)}
        mr={noInput ? 0 : 0.25}
      >
        {isNilValue && (
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
      </Div>
    )
  }, [size, value, noInput])

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
        xflex="x4"
      >
        {!noInput && (
          <Input
            slim
            short
            colorInput
            disabledNoBackground
            noStartIconPadding
            width={72}
            backgroundColor="background"
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            startIcon={renderInputAdornment()}
            value={selectedColor?.name ?? value}
            onChange={event => onChange(event.target.value)}
          />
        )}
        {noInput && renderInputAdornment()}
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
            <Div
              xflex="y2s"
              fontSize="0.75rem"
              gap={0.5}
              p={0.5}
            >
              {!!colors.length && (
                <>
                  Design system colors:
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
                </>
              )}
              Other colors:
              <Div
                xflex="x11"
                gap={0.25}
              >
                <Button
                  ghost
                  tiny
                  onClick={() => {
                    setCurrentValue('transparent')
                    onChange('transparent')
                  }}
                >
                  transparent
                </Button>
              </Div>
            </Div>
          </Div>
        )}
      </Div>
    </>
  )
}

export default ColorPicker
