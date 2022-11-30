import { Div } from 'honorable'
import { useState } from 'react'
import { ChromePicker } from 'react-color'

import { zIndexes } from '../../constants'

type ColorPickerPropsType = {
  size?: number
  value: string
  onChange: (value: string) => void
}

function ColorPicker({ size = 16, value, onChange }: ColorPickerPropsType) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Div
        position="relative"
        width={size}
        height={size}
        backgroundColor={value}
        cursor="pointer"
        onClick={() => setIsOpen(true)}
      >
        {isOpen && (
          <Div
            position="absolute"
            bottom={0}
            left={0}
            zIndex={zIndexes.colorPicker + 1}
            userSelect="none"
          >
            <ChromePicker
              color={value}
              onChangeComplete={color => onChange(color.hex)}
            />
          </Div>
        )}
      </Div>
      {isOpen && (
        <Div
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={zIndexes.colorPicker}
          userSelect="none"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default ColorPicker
