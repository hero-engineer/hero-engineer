import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { Div, H4, Input, P, useOutsideClick } from 'honorable'

import { refetchKeys } from '../../constants'

import {
  ComponentQuery,
  ComponentQueryDataType,
  UpdateFileDescriptionMutation,
  UpdateFileDescriptionMutationDataType,
} from '../../queries'

import useRefetch from '../../hooks/useRefetch'
import useIsComponentRefreshingQuery from '../../hooks/useIsComponentRefreshingQuery'

import HierarchyBar from '../core/HierarchyBar'
import EmojiPicker from '../core/EmojiPicker'

function ComponentMetadataSection() {
  const { fileAddress = '', componentAddress = '' } = useParams()
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [emoji, setEmoji] = useState('')
  const [description, setDescription] = useState('')
  const [isMetadataSet, setIsMetadataSet] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const [componentQueryResult, refetchComponentQuery] = useIsComponentRefreshingQuery(useQuery<ComponentQueryDataType>({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  }))
  const [, updateFileDescription] = useMutation<UpdateFileDescriptionMutationDataType>(UpdateFileDescriptionMutation)

  const refetch = useRefetch(
    {
      key: refetchKeys.component,
      refetch: refetchComponentQuery,
      skip: !componentAddress,
    },
  )

  const handleEditDescription = useCallback(() => {
    setIsEditingDescription(true)
  }, [])

  const handleDescriptionSubmit = useCallback(async () => {
    setIsEditingDescription(false)

    if (!isMetadataSet) return
    if (description === componentQueryResult.data?.component?.file.payload.description && emoji === componentQueryResult.data?.component?.file.payload.emoji) return

    await updateFileDescription({
      sourceFileAddress: fileAddress,
      description,
      emoji,
    })

    refetch(refetchKeys.component)
  }, [
    isMetadataSet,
    fileAddress,
    description,
    emoji,
    componentQueryResult.data?.component?.file.payload.description,
    componentQueryResult.data?.component?.file.payload.emoji,
    updateFileDescription,
    refetch,
  ])

  useOutsideClick(descriptionRef, handleDescriptionSubmit)

  useEffect(() => {
    if (!componentQueryResult.data) return

    setDescription(componentQueryResult.data.component?.file.payload.description ?? '')
    setEmoji(componentQueryResult.data.component?.file.payload.emoji ?? '')
    setIsMetadataSet(true)
  }, [componentQueryResult.data])

  // Select the content of the description input when editing
  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.select()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef.current])

  if (componentQueryResult.error) {
    return null
  }
  if (!componentQueryResult.data?.component) {
    return null
  }

  const { component } = componentQueryResult.data.component

  if (!component) {
    return null
  }

  return (
    <Div width="100%">
      <Div
        xflex="x4"
        gap={0.5}
      >
        <EmojiPicker
          emoji={emoji}
          setEmoji={setEmoji}
        />
        <H4>{component.payload.name}</H4>
      </Div>
      <P
        color="text-light"
        fontSize={12}
        mt={1}
      >
        {component.payload.relativePath}
      </P>
      <Div
        ref={descriptionRef}
        color="text-light"
        cursor="pointer"
        minHeight={19} // To match the Input min-height
        mt={0.5}
        onClick={handleEditDescription}
      >
        {isEditingDescription ? (
          <Input
            inputProps={{ ref: inputRef }}
            bare
            multiline
            autoFocus
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="..."
            width="100%"
            color="text-light"
          />
        ) : description || 'Click to add a description'}
      </Div>
    </Div>
  )
}

export default ComponentMetadataSection
