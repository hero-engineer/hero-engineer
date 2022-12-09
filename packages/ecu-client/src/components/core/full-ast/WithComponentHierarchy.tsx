import { ReactNode, useCallback, useContext, useEffect, useRef } from 'react'

import { createHierarchies } from '~processors'

import AstsContext from '~contexts/AstsContext'

import useCurrentComponentPath from '~hooks/useCurrentComponentPath'
import useThrottleAsynchronous from '~hooks/useThrottleAsynchronous'
import usePreviousWithDefault from '~hooks/usePreviousWithDefault'

type WithComponentHierarchyPropsType = {
  children: ReactNode
}

function WithComponentHierarchy({ children }: WithComponentHierarchyPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { asts } = useContext(AstsContext)
  const path = useCurrentComponentPath()
  const previousPath = usePreviousWithDefault(path, path)

  const computeHierarchies = useCallback((componentElement: HTMLElement | null) => {
    if (!componentElement) return

    const componentElements: HTMLElement[] = []

    for (const child of componentElement.children) {
      componentElements.push(child as HTMLElement)
    }

    const hierarchies = createHierarchies(asts, path, componentElements)

    console.log('hierarchies', hierarchies)
  }, [asts, path])

  const throttledComputeHierarchies = useThrottleAsynchronous(computeHierarchies, 500, true)

  useEffect(() => {
    if (!rootRef.current) return

    const observer = new MutationObserver(() => throttledComputeHierarchies(rootRef.current))

    observer.observe(rootRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  // Will be triggered twice on mount but throttledComputeHierarchies will be called only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef.current, throttledComputeHierarchies])

  useEffect(() => {
    if (!rootRef.current || path === previousPath) return

    computeHierarchies(rootRef.current)
  }, [path, previousPath, computeHierarchies])

  return (
    <div ref={rootRef}>
      {children}
    </div>
  )
}

export default WithComponentHierarchy
