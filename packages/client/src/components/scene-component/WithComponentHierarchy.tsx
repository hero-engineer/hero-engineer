import { ReactNode, useCallback, useContext, useEffect, useRef } from 'react'

import createHierarchy from '~processors/typescript/createHierarchy'

import LogsContext from '~contexts/LogsContext'
import HierarchyContext from '~contexts/HierarchyContext'

import useCurrentComponentPath from '~hooks/useCurrentComponentPath'
import useThrottleAsynchronous from '~hooks/useThrottleAsynchronous'
import usePreviousWithDefault from '~hooks/usePreviousWithDefault'

type WithComponentHierarchyPropsType = {
  children: ReactNode
}

function WithComponentHierarchy({ children }: WithComponentHierarchyPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  const path = useCurrentComponentPath()
  const previousPath = usePreviousWithDefault(path, path)

  const { setHierarchy } = useContext(HierarchyContext)
  const { logs } = useContext(LogsContext)

  const computeHierarchy = useCallback(async (componentElement: HTMLElement | null) => {
    if (!componentElement) return

    const componentElements: HTMLElement[] = []

    for (const child of componentElement.childNodes) {
      componentElements.push(child as HTMLElement)
    }

    const hierarchy = await createHierarchy(path, componentElements, logs.typescript)

    if (logs.typescript) console.log('hierarchy', hierarchy)

    setHierarchy(hierarchy)
  }, [path, logs.typescript, setHierarchy])

  const throttledComputeHierarchy = useThrottleAsynchronous(computeHierarchy, 250, true)

  useEffect(() => {
    if (!rootRef.current) return

    const observer = new MutationObserver(() => throttledComputeHierarchy(rootRef.current))

    observer.observe(rootRef.current, {
      characterData: true,
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  // Will be triggered twice on mount but throttledComputeHierarchies will be called only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef.current, throttledComputeHierarchy])

  useEffect(() => {
    if (!rootRef.current || path === previousPath) return

    computeHierarchy(rootRef.current)
  }, [path, previousPath, computeHierarchy])

  return (
    <div ref={rootRef}>
      {children}
    </div>
  )
}

export default WithComponentHierarchy
