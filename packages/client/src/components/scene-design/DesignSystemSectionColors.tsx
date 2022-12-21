import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Div, H2, Input } from 'honorable'
import { SlTrash } from 'react-icons/sl'
import shortId from 'shortid'

import { CssVariableType } from '~types'

import { SaveFileMutation, SaveFileMutationDataType } from '~queries'

import getColors from '~processors/css/getColors'
import setVariables from '~processors/css/setVariables'

import DesignSystemIsEditModeContext from '~contexts/DesignSystemIsEditModeContext'

import useAsync from '~hooks/useAsync'
import useMutation from '~hooks/useMutation'

import ColorPicker from '~components/css-inputs/ColorPicker'

function DesignSystemSectionColors() {
  const isEditMode = useContext(DesignSystemIsEditModeContext)

  const [colors, setColors] = useState<CssVariableType[]>([])
  const foundColors = useAsync(getColors, [])

  const [, saveFile] = useMutation<SaveFileMutationDataType>(SaveFileMutation)

  const handleColorsChange = useCallback(async (colors: CssVariableType[]) => {
    setColors(colors)

    const { filePath, code } = await setVariables(colors, 'color')

    await saveFile({
      filePath,
      code,
      commitMessage: 'Update color variables in index.css',
    })
  }, [saveFile])

  const handleCreateColor = useCallback(() => {
    const id = shortId()

    handleColorsChange([
      ...colors,
      {
        id: `--color-${id}`,
        type: 'color',
        name: `Color ${colors.length + 1}`,
        value: '#ffffff',
      },
    ])
  }, [colors, handleColorsChange])

  useEffect(() => {
    if (!foundColors) return

    setColors(foundColors)
  }, [foundColors])

  return (
    <Div xflex="y2s">
      <Div
        xflex="x5b"
        gap={1}
        mb={2}
      >
        <H2>
          Colors
        </H2>
        {isEditMode && (
          <Button onClick={handleCreateColor}>
            Add color
          </Button>
        )}
      </Div>
      <Div
        xflex="x11"
        columnGap={2}
        rowGap={1}
      >
        {colors?.map(color => (
          <ColorItem
            key={color.id}
            color={color}
            isEditMode={isEditMode}
            onChange={color => handleColorsChange(colors.map(c => c.id === color.id ? color : c))}
            onDelete={() => handleColorsChange(colors.filter(c => c.id !== color.id))}
          />
        ))}
        {!colors?.length && (
          <Div color="text-light">
            No colors
          </Div>
        )}
      </Div>
    </Div>
  )
}

type ColorItemPropsType = {
  color: CssVariableType
  isEditMode: boolean
  onChange: (color: CssVariableType) => void
  onDelete: () => void
}

function ColorItem({ color, isEditMode, onChange, onDelete }: ColorItemPropsType) {
  const [name, setName] = useState(color.name)

  const handleUpdateName = useCallback(() => {
    if (!name) return

    onChange({ ...color, name })
  }, [color, name, onChange])

  return (
    <Div
      xflex="y2"
      width={128}
      minWidth={0} // For ellipsis to work
      gap={0.5}
    >
      {isEditMode ? (
        <Input
          bare
          flexGrow
          width="100%"
          inputProps={{ textAlign: 'center' }}
          value={name}
          onChange={event => setName(event.target.value)}
          onBlur={handleUpdateName}
          onEnter={handleUpdateName}
        />
      ) : (
        <Div
          ellipsis
          maxWidth="100%"
        >
          {color.name}
        </Div>
      )}
      <Div>
        {color.value}
      </Div>
      <Div
        xflex="x5"
        elevation={1}
      >
        {isEditMode ? (
          <ColorPicker
            noInput
            size={128}
            value={color.value}
            onChange={value => onChange({ ...color, value })}
          />
        ) : (
          <Div
            width={128}
            height={128}
            backgroundColor={color.value}
          />
        )}
      </Div>
      {isEditMode && (
        <Button
          tiny
          danger
          fontSize="0.75rem"
          onClick={onDelete}
        >
          <SlTrash />
        </Button>
      )}
    </Div>
  )
}

export default DesignSystemSectionColors
