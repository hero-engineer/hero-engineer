import { memo, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import { Div, P } from 'honorable'
import html2canvas from 'html2canvas'

import { refetchKeys } from '../../constants'

import { ComponentQuery, ComponentQueryDataType, UpdateComponentScreenshotMutation, UpdateComponentScreenshotMutationDataType } from '../../queries'

import useRefetch from '../../hooks/useRefetch'

import ComponentLoader from './ComponentLoader'
import HierarchyBar from './HierarchyBar'
import ContextualInformation from './ContextualInformation'
import DragAndDropEndModal from './DragAndDropEndModal'

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

function Component() {
  const { componentAddress = '' } = useParams()
  const rootRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  const [componentQueryResult, refetchComponentQuery] = useQuery<ComponentQueryDataType>({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  })
  const [, updateComponentScreenshot] = useMutation<UpdateComponentScreenshotMutationDataType>(UpdateComponentScreenshotMutation)

  const takeScreenshot = useCallback(async () => {
    if (!componentRef.current) return

    const componentElement = componentRef.current.cloneNode(true) as HTMLElement

    traverseElementToRemoveEcuClasses(componentElement)

    // Hidden by overflow: hidden on layout
    document.body.appendChild(componentElement)

    const canvas = await html2canvas(componentElement)

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

  useRefetch(
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
    >
      <Div
        xflex="x4"
        gap={0.5}
      >
        <P fontWeight="bold">{component.payload.name}</P>
        <P
          color="text-light"
          fontSize={12}
        >
          {component.payload.relativePath}
        </P>
      </Div>
      <HierarchyBar />
      <Div
        ref={componentRef}
        xflex="y2s"
        flexGrow
        flexShrink={0}
        pt={1}
        pb={6}
      >
        <ComponentLoader component={component} />
      </Div>
      <ContextualInformation scrollRef={rootRef} />
      <DragAndDropEndModal />
    </Div>
  )
}

export default memo(Component)
