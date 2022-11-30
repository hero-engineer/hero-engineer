import { FormEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { Button, Div, Form, H3, Input, Switch } from 'honorable'
import { CiEdit } from 'react-icons/ci'
import { SlTrash } from 'react-icons/sl'
import { BsCheck2, BsPlus } from 'react-icons/bs'
import { IoCloseOutline } from 'react-icons/io5'

import { FontType } from '../../types'
import { refetchKeys } from '../../constants'

import { FontsQuery, FontsQueryDataType, UpdateFontsMutation, UpdateFontsMutationDataType } from '../../queries'

import useQuery from '../../hooks/useQuery'
import useRefetch from '../../hooks/useRefetch'
import useMutation from '../../hooks/useMutation'

function DesignSystemSubSectionFonts() {
  const [fonts, setFonts] = useState<FontType[]>([])

  const [fontsQueryResult, refetchFontsQuery] = useQuery<FontsQueryDataType>({
    query: FontsQuery,
  })
  const [, updateFonts] = useMutation<UpdateFontsMutationDataType>(UpdateFontsMutation)

  useRefetch({
    key: refetchKeys.fonts,
    refetch: refetchFontsQuery,
  })

  const handleEdit = useCallback(async (fonts: FontType[]) => {
    setFonts(fonts)

    await updateFonts({
      fontsJson: JSON.stringify(fonts),
    })
  }, [updateFonts])

  const handleUpdate = useCallback((font: FontType) => {
    const nextFonts = [...fonts]
    const fontIndex = nextFonts.findIndex(f => f.id === font.id)

    nextFonts[fontIndex] = font

    handleEdit(nextFonts)
  }, [fonts, handleEdit])

  const handleDelete = useCallback((font: FontType) => {
    if (!window.confirm(`Are you sure you want to delete the font ${font.name}?`)) return

    handleEdit(fonts.filter(f => f.id !== font.id))
  }, [fonts, handleEdit])

  useEffect(() => {
    if (!fontsQueryResult.data?.fonts) return

    setFonts(fontsQueryResult.data.fonts)
  }, [fontsQueryResult.data])

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
      {!fonts.length && (
        <Div
          color="text-light"
          py={0.5}
        >
          {fontsQueryResult.fetching ? 'Fetching...' : 'No fonts'}
        </Div>
      )}
      <Button
        onClick={() => setFonts(x => [
          ...x,
          {
            id: Math.random.toString().slice(2),
            name: '',
            url: '',
            isVariable: false,
            weights: [],
          },
        ])}
        alignSelf="flex-start"
        mt={0.5}
      >
        Add font
      </Button>

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
  const [isEdited, setIsEdited] = useState(!font.name)
  const [isError, setIsError] = useState(false)
  const [name, setName] = useState(font.name)
  const [url, setUrl] = useState(font.url)
  const [isVariable, setIsVariable] = useState(font.isVariable)
  const [weights, setWeights] = useState<(number | string)[]>(font.weights)

  const handleCancel = useCallback(() => {
    setIsEdited(false)
    setName(font.name)
    setUrl(font.url)
    setIsVariable(font.isVariable)
    setWeights(font.weights)
  }, [font])

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!(name && url && (isVariable || weights.map(Number).filter(Boolean).length))) {
      setIsError(true)

      return
    }

    setIsEdited(false)
    setIsError(false)

    onUpdate({
      ...font,
      name,
      url,
      isVariable,
      weights: weights.map(Number).filter(Boolean),
    })
  }, [font, name, url, isVariable, weights, onUpdate])

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
              isVariable={isVariable}
              weights={weights}
              onChange={(isVariable: boolean, weights: (number | string)[]) => {
                setIsVariable(isVariable)
                setWeights(weights)
              }}
            />
          ) : font.isVariable ? 'Variable' : font.weights.join(', ')}
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
              placeholder="https://fonts.googleapis.com/css2?family=..."
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
          xflex="x4"
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
          xflex="x4"
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
          {isError && (
            <Div color="danger">
              Please fill all fields
            </Div>
          )}
        </Div>
      )}
    </Form>
  )
}

type FontWeightsEditorPropsType = {
  isVariable: boolean
  weights: (number | string)[]
  onChange: (variable: boolean, weights: (number | string)[]) => void
}

function FontWeightsEditor({ isVariable, weights, onChange }: FontWeightsEditorPropsType) {
  return (
    <Div
      xflex="y2s"
      py={0.5}
      gap={0.5}
    >
      <Switch
        checked={isVariable}
        onChange={event => onChange(event.target.checked, weights)}
        ml="2px"
      >
        Variable
      </Switch>
      {!isVariable && (
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

                onChange(isVariable, nextWeights)
              }}
            />
          ))}
          <Button
            type="button"
            onClick={() => onChange(isVariable, [...weights, ''])}
          >
            <BsPlus />
          </Button>
        </>
      )}
    </Div>
  )
}

export default DesignSystemSubSectionFonts
