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

import HierarchyBar from '../core/HierarchyBar'
import DragAndDropEndModal from '../core/DragAndDropEndModal'
import EmojiPicker from '../core/EmojiPicker'
import ComponentWindow from '../core/ComponentWindow'

function traverseElementToRemoveEcuClasses(element: HTMLElement) {
  const classes: string[] = []

  element.classList.forEach(klass => {
    // HACK Ignore ecu-can-be-edited for now
    if (klass.startsWith('ecu-') && klass !== 'ecu-can-be-edited') {
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
    <Div
      ref={rootRef}
      xflex="y2s"
      flexGrow
      maxHeight="100%"
      overflowY="auto"
      userSelect="none"
      pt={1}
    >
      <Div
        xflex="x4"
        gap={0.5}
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
      <ComponentWindow
        componentPath={component.payload.path}
        componentRef={componentRef}
      />
      <DragAndDropEndModal />
    </Div>
  )
}

export default Component
