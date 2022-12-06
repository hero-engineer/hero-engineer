import { ReactNode, memo, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'

// import { refetchKeys } from '@constants'

import {
  UpdateComponentScreenshotMutation,
  UpdateComponentScreenshotMutationDataType,
} from '@queries'

import useMutation from '@hooks/useMutation'

// import useRefetch from '@hooks/useRefetch'

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

type WithComponentScrenshotPropsType = {
  children: ReactNode
}

function WithComponentScrenshot({ children }: WithComponentScrenshotPropsType) {
  const { componentAddress = '' } = useParams()

  const componentRef = useRef<HTMLDivElement>(null)

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

  // const takeScreenshotWithTimeout = useCallback(() => {
  //   setTimeout(takeScreenshot, 1000)
  // }, [takeScreenshot])

  // useRefetch(
  //   {
  //     key: refetchKeys.componentScreenshot,
  //     refetch: takeScreenshotWithTimeout,
  //     skip: !componentAddress,
  //   }
  // )

  return (
    <div ref={componentRef}>
      {children}
    </div>
  )
}

export default memo(WithComponentScrenshot)
