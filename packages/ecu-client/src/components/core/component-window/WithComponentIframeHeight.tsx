import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from 'react'

type WithComponentIframeHeightPropsType = {
  setHeight: Dispatch<SetStateAction<number>>
  children: ReactNode
}

function WithComponentIframeHeight({ setHeight, children }: WithComponentIframeHeightPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const observer = new ResizeObserver(() => {
      if (!rootRef.current) return

      setHeight(rootRef.current.offsetHeight)
    })

    observer.observe(rootRef.current)

    return () => {
      observer.disconnect()
    }
  }, [setHeight])

  return (
    <div ref={rootRef}>
      {children}
    </div>
  )
}

export default WithComponentIframeHeight
