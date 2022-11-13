import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { Button, Div, Input } from 'honorable'

import { refetchKeys } from '../../constants'

import { FileTypesQuery, FileTypesQueryDataType, WriteFileTypesMutation, WriteFileTypesMutationDataType } from '../../queries'

import useRefetch from '../../hooks/useRefetch'

function ComponentTypesEditor() {
  const { fileAddress = '' } = useParams()
  const [rawTypes, setRawTypes] = useState('')

  const [fileTypesQueryResult, refetchFileTypesQuery] = useQuery<FileTypesQueryDataType>({
    query: FileTypesQuery,
    variables: {
      sourceFileAddress: fileAddress,
    },
  })
  const [, writeFileTypes] = useMutation<WriteFileTypesMutationDataType>(WriteFileTypesMutation)

  const refetch = useRefetch(refetchKeys.fileTypes, refetchFileTypesQuery)

  const handleSave = useCallback(async () => {
    await writeFileTypes({
      sourceFileAddress: fileAddress,
      rawTypes,
    })

    console.log('refetch about to be called')

    refetch(refetchKeys.fileImports)
  }, [writeFileTypes, fileAddress, rawTypes, refetch])

  useEffect(() => {
    if (!fileTypesQueryResult.data?.fileTypes) return

    setRawTypes(fileTypesQueryResult.data?.fileTypes.rawTypes)
  }, [fileTypesQueryResult.data])

  return (
    <Div>
      <Input
        multiline
        minRows={3}
        width="100%"
        value={rawTypes}
        onChange={event => setRawTypes(event.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </Div>
  )
}

export default ComponentTypesEditor
