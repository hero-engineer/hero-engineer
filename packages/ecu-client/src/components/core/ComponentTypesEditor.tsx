import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { Button, Div, Input } from 'honorable'

import { FileTypesQuery, FileTypesQueryDataType, WriteFileTypesMutation, WriteFileTypesMutationDataType } from '../../queries'

function ComponentTypesEditor() {
  const { fileAddress = '' } = useParams()
  const [rawTypes, setRawTypes] = useState('')

  const [fileTypesQueryResult] = useQuery<FileTypesQueryDataType>({
    query: FileTypesQuery,
    variables: {
      sourceFileAddress: fileAddress,
    },
  })
  const [, writeFileTypes] = useMutation<WriteFileTypesMutationDataType>(WriteFileTypesMutation)

  const handleSave = useCallback(() => {
    writeFileTypes({
      sourceFileAddress: fileAddress,
      rawTypes,
    })
  }, [writeFileTypes, fileAddress, rawTypes])

  useEffect(() => {
    if (!fileTypesQueryResult.data?.fileTypes) {
      return
    }

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
