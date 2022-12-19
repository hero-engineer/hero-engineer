import { useCallback, useEffect, useState } from 'react'
import { Button, Div, H2, Input } from 'honorable'
import shortId from 'shortid'

import { CssVariableType } from '~types'

import getColors from '~processors/css/getColors'

import useAsync from '~hooks/useAsync'

import ColorPicker from '~components/css-inputs/ColorPicker'

function DesignSystemSectionColors() {
  const [colors, setColors] = useState<CssVariableType[]>([])

  const foundColors = useAsync(getColors, [])

  const handleColorChange = useCallback(async (colors: CssVariableType[]) => {
    setColors(colors)

    // await updateColors({
    //   colorsJson: JSON.stringify(colors),
    // })
  }, [])

  const handleCreateColor = useCallback(() => {
    const id = shortId()

    handleColorChange([
      ...colors,
      {
        id: `--color-${id}`,
        type: 'color',
        name: `Color ${colors.length + 1}`,
        value: '#ffffff',
      },
    ])
  }, [colors, handleColorChange])

  useEffect(() => {
    if (!foundColors) return

    setColors(foundColors)
  }, [foundColors])

  return (
    <Div xflex="y2s">
      <H2 mb={2}>Colors</H2>
      <Div
        xflex="x11"
        columnGap={2}
        rowGap={1}
      >
        {colors?.map(color => (
          <ColorItem
            key={color.id}
            color={color}
            onChange={color => handleColorChange(colors.map(c => c.id === color.id ? color : c))}
          />
        ))}
        {!colors?.length && (
          <Div color="text-light">
            No colors
          </Div>
        )}
      </Div>
      <Button
        onClick={handleCreateColor}
        alignSelf="flex-start"
        mt={1}
      >
        Add color
      </Button>
    </Div>
  )
}

type ColorItemPropsType = {
  color: CssVariableType
  onChange: (color: CssVariableType) => void
}

function ColorItem({ color, onChange }: ColorItemPropsType) {
  const [name, setName] = useState(color.name)
  const [isEdited, setIsEdited] = useState(false)

  const handleUpdateName = useCallback(() => {
    setIsEdited(false)

    if (!name) return

    onChange({
      ...color,
      name,
    })
  }, [color, name, onChange])

  return (
    <Div
      xflex="y2"
      width={128}
      maxWidth="100%"
      minWidth={0}// For ellipsis to work
      gap={0.75}
    >
      <Div
        ellipsis
        onClick={() => setIsEdited(true)}
        px={0.5}
      >
        {isEdited ? (
          <Input
            bare
            autoFocus
            autoSelect
            width="100%"
            inputProps={{ textAlign: 'center' }}
            value={name}
            onChange={event => setName(event.target.value)}
            onBlur={handleUpdateName}
            onEnter={handleUpdateName}
          />
        ) : color.name}
      </Div>
      <Div>
        {color.value}
      </Div>
      <Div
        xflex="x5"
        elevation={1}
      >
        <ColorPicker
          noInput
          size={128}
          value={color.value}
          onChange={value => onChange({ ...color, value })}
        />
      </Div>
    </Div>
  )
}

export default DesignSystemSectionColors
