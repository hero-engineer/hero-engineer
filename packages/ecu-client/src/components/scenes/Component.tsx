import { useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import html2canvas from 'html2canvas'

import { refetchKeys } from '../../constants'

import {
  ComponentQuery,
  ComponentQueryDataType,
  UpdateComponentScreenshotMutation,
  UpdateComponentScreenshotMutationDataType,
} from '../../queries'

import useRefetch from '../../hooks/useRefetch'
import useClearHierarchyIdsAndComponentDeltaOnClick from '../../hooks/useClearHierarchyIdsAndComponentDeltaOnClick'
import useIsComponentRefreshingQuery from '../../hooks/useIsComponentRefreshingQuery'

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
  const { componentAddress = '' } = useParams()
  const rootRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  useClearHierarchyIdsAndComponentDeltaOnClick(rootRef)
  useClearHierarchyIdsAndComponentDeltaOnClick(componentRef)

  const [componentQueryResult, refetchComponentQuery] = useIsComponentRefreshingQuery(useQuery<ComponentQueryDataType>({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  }))
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
    <ComponentWindow
      componentPath={component.payload.path}
      componentRef={componentRef}
    />
  )
}

export default Component
