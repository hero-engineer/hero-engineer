import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { A, Button, Div, Input } from 'honorable'

import { refetchKeys } from '@constants'

import { FileTypesQuery, FileTypesQueryDataType, UpdateFileTypesMutation, UpdateFileTypesMutationDataType } from '@queries'

import useQuery from '@hooks/useQuery'
import useMutation from '@hooks/useMutation'
import useRefetch from '@hooks/useRefetch'

import GlobalTypesModal from './GlobalTypesModal'

// The component types editor
// Displayed in the right panel
function ComponentTypesEditor() {
  const { fileAddress = '' } = useParams()
  const [rawTypes, setRawTypes] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [fileTypesQueryResult, refetchFileTypesQuery] = useQuery<FileTypesQueryDataType>({
    query: FileTypesQuery,
    variables: {
      sourceFileAddress: fileAddress,
    },
  })
  const [, updateFileTypes] = useMutation<UpdateFileTypesMutationDataType>(UpdateFileTypesMutation)

  const refetch = useRefetch({
    key: refetchKeys.fileTypes,
    refetch: refetchFileTypesQuery,
    skip: !fileAddress,
  })

  const handleSave = useCallback(async () => {
    await updateFileTypes({
      sourceFileAddress: fileAddress,
      rawTypes,
    })

    console.log('refetch about to be called')

    refetch(refetchKeys.fileImports)
  }, [updateFileTypes, fileAddress, rawTypes, refetch])

  useEffect(() => {
    if (!fileTypesQueryResult.data?.fileTypes) return

    setRawTypes(fileTypesQueryResult.data?.fileTypes.rawTypes)
  }, [fileTypesQueryResult.data])

  return (
    <>
      <Div>
        <Input
          multiline
          minRows={3}
          width="100%"
          borderLeft="none"
          borderRight="none"
          borderRadius={0}
          value={rawTypes}
          onChange={event => setRawTypes(event.target.value)}
        />
        <Div
          xflex="x4"
          mt={0.5}
          px={1}
        >
          <A onClick={() => setIsModalOpen(true)}>
            Global types
          </A>
          <Div flexGrow />
          <Button onClick={handleSave}>Save</Button>
        </Div>
      </Div>
      <GlobalTypesModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default ComponentTypesEditor
