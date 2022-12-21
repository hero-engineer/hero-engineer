import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { A, Button, Div, H3, Input, Modal } from 'honorable'
import { SlTrash } from 'react-icons/sl'

import { TypefaceType } from '~types'

import { SaveFileMutation, SaveFileMutationDataType } from '~queries'

import getTypefaces from '~processors/css/getTypefaces'
import setTypefaces from '~processors/css/setTypefaces'

import DesignSystemIsEditModeContext from '~contexts/DesignSystemIsEditModeContext'

import useAsync from '~hooks/useAsync'
import useMutation from '~hooks/useMutation'

import extractTypefacesFromUrl from '~utils/extractTypefacesFromUrl'

function DesignSystemSubSectionTypefaces() {
  const isEditMode = useContext(DesignSystemIsEditModeContext)

  const [workingTypefaces, setWorkingTypefaces] = useState<TypefaceType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [typefaceUrl, setTypefaceUrl] = useState('')

  const foundTypefaces = useAsync(getTypefaces, [])
  const { isError, typefaces: addedTypefaces } = useMemo(() => extractTypefacesFromUrl(typefaceUrl), [typefaceUrl])

  const [, saveFile] = useMutation<SaveFileMutationDataType>(SaveFileMutation)

  const handleTypefacesChange = useCallback(async (typefaces: TypefaceType[]) => {
    setWorkingTypefaces(typefaces)

    const { filePath, code } = await setTypefaces(typefaces)

    await saveFile({
      filePath,
      code,
      commitMessage: 'Update typeface imports in index.css',
    })
  }, [saveFile])

  const handleCreateTypeface = useCallback(() => {
    if (isError) return

    setIsModalOpen(false)
    setTypefaceUrl('')

    handleTypefacesChange([...workingTypefaces, ...addedTypefaces])
  }, [isError, workingTypefaces, addedTypefaces, handleTypefacesChange])

  const handleDeleteTypeface = useCallback((typeface: TypefaceType) => {
    if (!window.confirm(`Are you sure you want to delete the typeface ${typeface.name}?`)) return

    handleTypefacesChange(workingTypefaces.filter(f => f.url !== typeface.url))
  }, [workingTypefaces, handleTypefacesChange])

  useEffect(() => {
    if (!foundTypefaces) return

    setWorkingTypefaces(foundTypefaces)
  }, [foundTypefaces])

  return (
    <Div xflex="y2s">
      <Div
        xflex="x5b"
        gap={1}
        mb={1}
      >
        <H3>
          Typefaces
        </H3>
        {isEditMode && (
          <Button onClick={() => setIsModalOpen(true)}>
            Add typeface
          </Button>
        )}
      </Div>
      <FontHeader />
      {workingTypefaces.map(typeface => (
        <FontRow
          key={typeface.url}
          typeface={typeface}
          isEditMode={isEditMode}
          onDelete={() => handleDeleteTypeface(typeface)}
        />
      ))}
      {!workingTypefaces.length && (
        <Div
          color="text-light"
          py={0.5}
        >
          No typefaces
        </Div>
      )}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <H3>
          Add typeface
        </H3>
        <Div mt={2}>
          Select one or more families from
          {' '}
          <A
            href="https://fonts.google.com/"
            target="_blank"
            rel="noopeneer noreferer"
          >
            Google Fonts
          </A>
          {' '}
          and paste the URL here.
        </Div>
        <Input
          value={typefaceUrl}
          onChange={event => setTypefaceUrl(event.target.value)}
          placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          width="100%"
          mt={1}
        />
        {isError && (
          <Div
            color="danger"
            mt={1}
          >
            Invalid URL
          </Div>
        )}
        {!!addedTypefaces.length && (
          <Div mt={1}>
            This will add the following typefaces:
            <Div
              xflex="y2s"
              gap={0.5}
              mt={1}
            >
              {addedTypefaces.map(typeface => (
                <Div key={typeface.url}>
                  {typeface.name}
                  {' '}
                  -
                  {' '}
                  {typeface.weights.join(', ')}
                </Div>
              ))}
            </Div>
          </Div>
        )}
        <Div
          xflex="x6"
          gap={0.5}
          mt={2}
        >
          <Button
            secondary
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateTypeface}>
            Add typeface
            {addedTypefaces.length > 1 ? 's' : ''}
          </Button>
        </Div>
      </Modal>
    </Div>
  )
}

function FontHeader() {
  return (
    <Div
      xflex="x4"
      typefaceWeight="bold"
      py={0.5}
      gap={0.5}
    >
      <Div width={128 + 64}>
        Family
      </Div>
      <Div width={128 + 64}>
        Weights
      </Div>
      <Div width={512}>
        URL
      </Div>
    </Div>
  )
}

type FontRowPropsType = {
  typeface: TypefaceType
  isEditMode: boolean
  onDelete: () => void
}

function FontRow({ typeface, isEditMode, onDelete }: FontRowPropsType) {

  return (
    <Div
      xflex="x1"
      gap={0.5}
    >
      <Div
        xflex="x1"
        py={0.5}
        minWidth={0} // For ellipsis to work
        gap={0.5}
      >
        <Div
          ellipsis
          width={128 + 64}
        >
          {typeface.name}
        </Div>
        <Div
          ellipsis
          width={128 + 64}
        >
          {typeface.weights.join(', ')}
        </Div>
        <Div
          ellipsis
          width={512}
          fontSize="0.75rem"
          color="text-light"
          mt="2px"
        >
          {typeface.url}
        </Div>
      </Div>
      {isEditMode && (
        <Div
          xflex="x4"
          fontSize="0.75rem"
          gap={0.5}
          pt={0.25}
        >
          <Button
            tiny
            danger
            onClick={onDelete}
          >
            <SlTrash />
          </Button>
        </Div>
      )}
    </Div>
  )
}

export default DesignSystemSubSectionTypefaces
