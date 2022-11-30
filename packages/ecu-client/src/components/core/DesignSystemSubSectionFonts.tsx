import { FormEvent, MouseEvent, useCallback, useState } from 'react'
import { Button, Div, Form, H3, Input, Switch } from 'honorable'
import { CiEdit } from 'react-icons/ci'
import { SlTrash } from 'react-icons/sl'
import { BsCheck2, BsPlus } from 'react-icons/bs'
import { IoCloseOutline } from 'react-icons/io5'

import { FontType } from '../../types'

const fonts: FontType[] = [
  {
    id: '1',
    name: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    variable: false,
    weights: [400, 500, 600, 700],
  },
  {
    id: '2',
    name: 'Roboto',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    variable: false,
    weights: [400, 500, 700],
  },
]

function DesignSystemSubSectionFonts() {

  const handleEdit = useCallback((fonts: FontType[]) => {

  }, [])

  const handleUpdate = useCallback((font: FontType) => {
    const nextFonts = [...fonts]
    const fontIndex = nextFonts.findIndex(f => f.id === font.id)

    nextFonts[fontIndex] = font

    handleEdit(nextFonts)
  }, [handleEdit])

  const handleDelete = useCallback((font: FontType) => {
    if (!window.confirm(`Are you sure you want to delete the font ${font.name}?`)) return

    handleEdit(fonts.filter(f => f.id !== font.id))
  }, [handleEdit])

  return (
    <>
      <H3 mb={1}>Fonts</H3>
      <FontHeader />
      {fonts.map(font => (
        <FontRow
          key={font.id}
          font={font}
          onUpdate={(font: FontType) => handleUpdate(font)}
          onDelete={() => handleDelete(font)}
        />
      ))}
    </>
  )
}

function FontHeader() {
  return (
    <Div
      xflex="x4"
      fontWeight="bold"
      py={0.5}
      gap={0.5}
    >
      <Div width={128 + 32 + 8 + 2}>
        Family
      </Div>
      <Div width={128 + 32 + 8 + 2}>
        Weights
      </Div>
      <Div width={512}>
        URL
      </Div>
    </Div>
  )
}

type FontRowPropsType = {
  font: FontType
  onUpdate: (font: FontType) => void
  onDelete: () => void
}

function FontRow({ font, onUpdate, onDelete }: FontRowPropsType) {
  const [isEdited, setIsEdited] = useState(false)
  const [name, setName] = useState(font.name)
  const [url, setUrl] = useState(font.url)
  const [variable, setVariable] = useState(font.variable)
  const [weights, setWeights] = useState<(number | string)[]>(font.weights)

  const handleCancel = useCallback(() => {
    setIsEdited(false)
    setName(font.name)
    setUrl(font.url)
    setVariable(font.variable)
    setWeights(font.weights)
  }, [font])

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setIsEdited(false)
  }, [])

  return (
    <Form
      xflex="x1"
      gap={0.5}
      _hover={{
        '& #FontRow-actions': {
          display: 'flex',
        },
      }}
      onSubmit={handleSubmit}
    >
      <Div
        xflex="x1"
        py={0.5}
        minWidth={0}
        gap={0.5}
      >
        <Div
          ellipsis
          width={128 + 32 + 8 + 2}
        >
          {isEdited ? (
            <Input
              slim
              width="100%"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          ) : font.name}
        </Div>
        <Div
          ellipsis
          width={128 + 32 + 8 + 2}
        >
          {isEdited ? (
            <FontWeightsEditor
              variable={variable}
              weights={weights}
              onChange={(variable: boolean, weights: (number | string)[]) => {
                setVariable(variable)
                setWeights(weights)
              }}
            />
          ) : font.variable ? 'Variable' : font.weights.join(', ')}
        </Div>
        <Div
          ellipsis
          width={512}
          fontSize="0.75rem"
          color="text-light"
          mt={isEdited ? 0 : '2px'}
        >
          {isEdited ? (
            <Input
              slim
              width="100%"
              value={url}
              onChange={event => setUrl(event.target.value)}
            />
          ) : font.url}
        </Div>
      </Div>
      {!isEdited && (
        <Div
          id="FontRow-actions"
          display="none"
          xflex="x1"
          fontSize="0.75rem"
          gap={0.5}
          pt={0.25}
        >
          <Button
            tiny
            onClick={() => setIsEdited(true)}
          >
            <CiEdit />
          </Button>
          <Button
            tiny
            danger
            onClick={onDelete}
          >
            <SlTrash />
          </Button>
        </Div>
      )}
      {isEdited && (
        <Div
          xflex="x1"
          fontSize="0.75rem"
          gap={0.5}
          pt={1}
        >
          <Button
            tiny
            type="submit"
            onClick={handleSubmit}
          >
            <BsCheck2 />
          </Button>
          <Button
            tiny
            secondary
            onClick={handleCancel}
          >
            <IoCloseOutline />
          </Button>
        </Div>
      )}
    </Form>
  )
}

type FontWeightsEditorPropsType = {
  variable: boolean
  weights: (number | string)[]
  onChange: (variable: boolean, weights: (number | string)[]) => void
}

function FontWeightsEditor({ variable, weights, onChange }: FontWeightsEditorPropsType) {
  return (
    <Div
      xflex="y2s"
      py={0.5}
      gap={0.5}
    >
      <Switch
        checked={variable}
        onChange={event => onChange(event.target.checked, weights)}
        ml="2px"
      >
        Variable
      </Switch>
      {!variable && (
        <>
          {weights.map((weight, i) => (
            <Input
              key={i}
              slim
              type="number"
              width="100%"
              value={weight}
              onChange={event => {
                let nextWeight: string | number = parseInt(event.target.value, 10)

                if (nextWeight !== nextWeight) nextWeight = event.target.value

                const nextWeights = [...weights]

                nextWeights[i] = nextWeight

                onChange(variable, nextWeights)
              }}
            />
          ))}
          <Button
            type="button"
            onClick={() => onChange(variable, [...weights, ''])}
          >
            <BsPlus />
          </Button>
        </>
      )}
    </Div>
  )
}

export default DesignSystemSubSectionFonts
