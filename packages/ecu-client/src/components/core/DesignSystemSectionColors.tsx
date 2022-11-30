import { useCallback, useState } from 'react'
import { Button, Div, H2 } from 'honorable'

import { ColorType } from '../../types'

import ColorPicker from './ColorPicker'

const colorsBase: ColorType[] = [
  {
    id: '0',
    name: 'red',
    value: '#FF0000',
  },
  {
    id: '1',
    name: 'green',
    value: '#00FF00',
  },
  {
    id: '2',
    name: 'blue',
    value: '#0000FF',
  },
]

function DesignSystemSectionColors() {
  const [colors, setColors] = useState<ColorType[]>(colorsBase)

  const handleColorChange = useCallback((color: ColorType) => {
    const nextColors = [...colors]
    const colorIndex = nextColors.findIndex(c => c.id === color.id)

    nextColors[colorIndex] = color

    setColors(nextColors)
  }, [colors])

  return (
    <Div xflex="y2s">
      <H2 mb={2}>Colors</H2>
      <Div
        xflex="x11"
        gap={1}
      >
        {colors.map(color => (
          <ColorItem
            key={color.id}
            color={color}
            onChange={handleColorChange}
          />
        ))}
      </Div>
      <Button
        onClick={() => setColors(x => [
          ...x,
          {
            id: Math.random().toString().slice(2),
            name: `Color ${x.length + 1}`,
            value: '#ffffff',
          },
        ])}
        alignSelf="flex-start"
        mt={1}
      >
        Add color
      </Button>
    </Div>
  )
}

type ColorItemPropsType = {
  color: ColorType
  onChange: (color: ColorType) => void
}

function ColorItem({ color, onChange }: ColorItemPropsType) {
  return (
    <Div
      xflex="y2"
      gap={0.5}
    >
      <ColorPicker
        size={64}
        value={color.value}
        onChange={value => onChange({ ...color, value })}
      />
      {color.name}
    </Div>
  )
}

export default DesignSystemSectionColors
