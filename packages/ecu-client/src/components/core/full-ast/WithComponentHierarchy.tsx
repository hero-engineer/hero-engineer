import { ReactNode, useCallback, useContext, useEffect, useRef } from 'react'
import path from 'path-browserify'

// import { AstsType } from '~types'

import AstsContext from '~contexts/AstsContext'

import useCurrentComponentPath from '~hooks/useCurrentComponentPath'
import useThrottleAsynchronous from '~hooks/useThrottleAsynchronous'

type WithComponentHierarchyPropsType = {
  children: ReactNode
}

function WithComponentHierarchy({ children }: WithComponentHierarchyPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { asts } = useContext(AstsContext)
  const path = useCurrentComponentPath()

  const computeHierarchy = useCallback((componentElements: HTMLElement[], ast: File | null | undefined, path: string, hierarchies: any) => {
    console.log('computeHierarchy', path, componentElements)
  }, [])

  const computeHierarchies = useCallback((componentElement: HTMLElement | null) => {
    if (!(componentElement && asts[path])) return

    const hierarchies: any = {}
    const componentElements: HTMLElement[] = []

    for (const child of componentElement.children) {
      componentElements.push(child as HTMLElement)
    }

    hierarchies[path] = computeHierarchy(componentElements, asts[path].ast as File | null | undefined, path, hierarchies)
  }, [asts, path, computeHierarchy])

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

  return (
    <div ref={rootRef}>
      {children}
    </div>
  )
}

export default WithComponentHierarchy
