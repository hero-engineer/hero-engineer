import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Div, Input } from 'honorable'

import { refetchKeys } from '@constants'

import { FileImportsQuery, FileImportsQueryDataType, UpdateFileImportsMutation, UpdateFileImportsMutationDataType } from '@queries'

import useQuery from '@hooks/useQuery'
import useMutation from '@hooks/useMutation'
import useRefetch from '@hooks/useRefetch'

// Component imports editor
// Displayed in the right panel
function ComponentImportsEditor() {
  const { fileAddress = '' } = useParams()
  const [rawImports, setRawImports] = useState('')

  const [fileImportsQueryResult, refetchFileImportsQuery] = useQuery<FileImportsQueryDataType>({
    query: FileImportsQuery,
    variables: {
      sourceFileAddress: fileAddress,
    },
  })
  const [, updateFileImports] = useMutation<UpdateFileImportsMutationDataType>(UpdateFileImportsMutation)

  useRefetch({
    key: refetchKeys.fileImports,
    refetch: refetchFileImportsQuery,
    skip: !fileAddress,
  })

  const handleSave = useCallback(() => {
    updateFileImports({
      sourceFileAddress: fileAddress,
      rawImports,
    })
  }, [updateFileImports, fileAddress, rawImports])

  useEffect(() => {
    if (!fileImportsQueryResult.data?.fileImports) {
      return
    }

    setRawImports(fileImportsQueryResult.data?.fileImports.rawImports)
  }, [fileImportsQueryResult.data])

  return (
    <Div>
      <Input
        multiline
        minRows={3}
        width="100%"
        borderLeft="none"
        borderRight="none"
        borderRadius={0}
        value={rawImports}
        onChange={event => setRawImports(event.target.value)}
      />
      <Div
        xflex="x4"
        mt={0.5}
        px={1}
      >
        <Div flexGrow />
        <Button onClick={handleSave}>Save</Button>
      </Div>
    </Div>
  )
}

export default ComponentImportsEditor
