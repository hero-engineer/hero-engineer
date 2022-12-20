import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Div, H2, Input } from 'honorable'
import { SlTrash } from 'react-icons/sl'
import shortId from 'shortid'

import { CssVariableType } from '~types'

import { SaveFileMutation, SaveFileMutationDataType } from '~queries'

import getSpacings from '~processors/css/getSpacings'
import setVariables from '~processors/css/setVariables'

import DesignSystemIsEditModeContext from '~contexts/DesignSystemIsEditModeContext'

import useAsync from '~hooks/useAsync'
import useMutation from '~hooks/useMutation'

import CssValueInput from '~components/css-inputs/CssValueInput'

function DesignSystemSectionSpacings() {
  const isEditMode = useContext(DesignSystemIsEditModeContext)

  const [spacings, setSpacings] = useState<CssVariableType[]>([])
  const foundSpacings = useAsync(getSpacings, [])

  const [, saveFile] = useMutation<SaveFileMutationDataType>(SaveFileMutation)

  const handleSpacingsChange = useCallback(async (spacings: CssVariableType[]) => {
    setSpacings(spacings)

    const { filePath, code } = await setVariables(spacings, 'spacing')

    await saveFile({
      filePath,
      code,
      commitMessage: 'Update spacing variables in index.css',
    })
  }, [saveFile])

  const handleCreateSpacing = useCallback(() => {
    const id = shortId()

    handleSpacingsChange([
      ...spacings,
      {
        id: `--spacing-${id}`,
        type: 'spacing',
        name: `Spacing ${spacings.length + 1}`,
        value: '16px',
      },
    ])
  }, [spacings, handleSpacingsChange])

  useEffect(() => {
    if (!foundSpacings) return

    setSpacings(foundSpacings)
  }, [foundSpacings])

  return (
    <Div xflex="y2s">
      <Div
        xflex="x5b"
        gap={1}
        mb={2}
      >
        <H2>
          Spacing
        </H2>
        {isEditMode && (
          <Button onClick={handleCreateSpacing}>
            Add spacing
          </Button>
        )}
      </Div>
      <Div
        xflex="x11"
        columnGap={2}
        rowGap={1}
      >
        {spacings?.map(spacing => (
          <SpacingItem
            key={spacing.id}
            spacing={spacing}
            isEditMode={isEditMode}
            onChange={spacing => handleSpacingsChange(spacings.map(s => s.id === spacing.id ? spacing : s))}
            onDelete={() => handleSpacingsChange(spacings.filter(s => s.id !== spacing.id))}
          />
        ))}
        {!spacings?.length && (
          <Div color="text-light">
            No spacing variables
          </Div>
        )}
      </Div>

    </Div>
  )
}

type SpacingItemPropsType = {
  spacing: CssVariableType
  isEditMode: boolean
  onChange: (spacing: CssVariableType) => void
  onDelete: () => void
}

function SpacingItem({ spacing, isEditMode, onChange, onDelete }: SpacingItemPropsType) {
  const [name, setName] = useState(spacing.name)

  const handleUpdateName = useCallback(() => {
    if (!name) return

    onChange({ ...spacing, name })
  }, [spacing, name, onChange])

  return (
    <Div
      xflex="y2"
      width={`calc(max(${spacing.value}, 128px))`}
      minWidth={0} // For ellipsis to work
      gap={1}
    >
      {isEditMode ? (
        <Input
          bare
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
          {spacing.name}
        </Div>
      )}
      {isEditMode ? (
        <Div
          xflex="x5"
          fontSize="0.75rem"
        >
          <CssValueInput
            value={spacing.value}
            onChange={value => onChange({ ...spacing, value })}
          />
        </Div>
      ) : (
        <Div
          ellipsis
          maxWidth="100%"
        >
          {spacing.value}
        </Div>
      )}
      <Div
        width={spacing.value}
        height={spacing.value}
        backgroundColor="primary"
      />
      {isEditMode && (
        <Div
          xflex="x5"
          flexShrink={0}
          color="danger"
          fontSize="0.75rem"
          cursor="pointer"
          onClick={onDelete}
        >
          <SlTrash />
        </Div>
      )}
    </Div>
  )
}

export default DesignSystemSectionSpacings
