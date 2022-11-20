import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { Div, H4, Input, P, useOutsideClick } from 'honorable'
import html2canvas from 'html2canvas'

import { refetchKeys } from '../../constants'

import {
  ComponentQuery,
  ComponentQueryDataType,
  UpdateComponentScreenshotMutation,
  UpdateComponentScreenshotMutationDataType,
  UpdateFileDescriptionMutation,
  UpdateFileDescriptionMutationDataType,
} from '../../queries'

import useRefetch from '../../hooks/useRefetch'
import useClearHierarchyIdsAndComponentDeltaOnClick from '../../hooks/useClearHierarchyIdsAndComponentDeltaOnClick'
import useIsComponentRefreshingQuery from '../../hooks/useIsComponentRefreshingQuery'

import ComponentLoader from '../core/ComponentLoader'
import HierarchyBar from '../core/HierarchyBar'
import ContextualInformation from '../core/ContextualInformation'
import DragAndDropEndModal from '../core/DragAndDropEndModal'
import EmojiPicker from '../core/EmojiPicker'

function traverseElementToRemoveEcuClasses(element: HTMLElement) {
  const classes: string[] = []

  element.classList.forEach(klass => {
    if (klass.startsWith('ecu-')) {
      classes.push(klass)
    }
  })

  classes.forEach(klass => element.classList.remove(klass))

  for (const child of element.children) {
    traverseElementToRemoveEcuClasses(child as HTMLElement)
  }
}

// Component scene
function Component() {
  const { fileAddress = '', componentAddress = '' } = useParams()
  const rootRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [emoji, setEmoji] = useState('')
  const [description, setDescription] = useState('')
  const [isMetadataSet, setIsMetadataSet] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  useClearHierarchyIdsAndComponentDeltaOnClick(rootRef)
  useClearHierarchyIdsAndComponentDeltaOnClick(componentRef)

  const [componentQueryResult, refetchComponentQuery] = useIsComponentRefreshingQuery(useQuery<ComponentQueryDataType>({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  }))
  const [, updateFileDescription] = useMutation<UpdateFileDescriptionMutationDataType>(UpdateFileDescriptionMutation)
  const [, updateComponentScreenshot] = useMutation<UpdateComponentScreenshotMutationDataType>(UpdateComponentScreenshotMutation)

  // Take a screenshot of the current component
  const takeScreenshot = useCallback(async () => {
    if (!componentRef.current) return

    const componentElement = componentRef.current.cloneNode(true) as HTMLElement

    traverseElementToRemoveEcuClasses(componentElement)

    // Hidden by overflow: hidden on layout
    document.body.appendChild(componentElement)

    const canvas = await html2canvas(componentElement, { logging: false })

    // Cleanup
    document.body.removeChild(componentElement)

    const dataUrl = canvas.toDataURL('image/png')

    await updateComponentScreenshot({
      sourceComponentAddress: componentAddress,
      dataUrl,
    })
  }, [updateComponentScreenshot, componentAddress])

  const takeScreenshotWithTimeout = useCallback(() => {
    setTimeout(takeScreenshot, 1000)
  }, [takeScreenshot])

  const refetch = useRefetch(
    {
      key: refetchKeys.component,
      refetch: refetchComponentQuery,
      skip: !componentAddress,
    },
    {
      key: refetchKeys.componentScreenshot,
      refetch: takeScreenshotWithTimeout,
      skip: !componentAddress,
    }
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

    refetch(refetchKeys.components)
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
    <Div
      ref={rootRef}
      xflex="y2s"
      flexGrow={1}
      maxHeight="100%"
      overflowY="auto"
      px="1px" // To allow ecu-elected borders to be visible
      userSelect="none"
    >
      <Div
        xflex="x4"
        gap={0.5}
        mt={0.75}
      >
        <EmojiPicker
          emoji={emoji}
          setEmoji={setEmoji}
        />
        <H4>{component.payload.name}</H4>
        <HierarchyBar />
      </Div>
      <P
        color="text-light"
        fontSize={12}
        mt={1}
      >
        {component.payload.relativePath}
      </P>
      <P
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
            ghost
            multiline
            autoFocus
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="..."
            width="100%"
            color="text-light"
            border="none"
          />
        ) : description || 'Click to add a description'}
      </P>
      <Div
        ref={componentRef}
        xflex="y2s" // No flexGrow for outside click to work
        flexShrink={0}
        pt={1}
        pb={6}
      >
        <ComponentLoader componentPath={component.payload.path} />
      </Div>
      <ContextualInformation scrollRef={rootRef} />
      <DragAndDropEndModal />
    </Div>
  )
}

export default Component