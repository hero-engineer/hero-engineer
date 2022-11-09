import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { Button, Div, Input } from 'honorable'

import { ComponentTypesQuery, ComponentTypesQueryDataType, WriteFileTypesMutation, WriteFileTypesMutationDataType } from '../../queries'

function ComponentTypesEditor() {
  const { fileAddress = '', componentAddress = '' } = useParams()
  const [rawTypes, setRawTypes] = useState('')

  const [componentTypesQueryResult] = useQuery<ComponentTypesQueryDataType>({
    query: ComponentTypesQuery,
    variables: {
      sourceComponentAddress: componentAddress,
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
    if (!componentTypesQueryResult.data?.componentTypes) {
      return
    }

    setRawTypes(componentTypesQueryResult.data?.componentTypes.rawTypes)
  }, [componentTypesQueryResult.data])

  console.log('componentTypesQueryResult.data', componentTypesQueryResult.data)

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
