import { Dispatch, ReactNode, SetStateAction, memo, useEffect, useRef } from 'react'

type WithComponentIframeHeightPropsType = {
  setHeight: Dispatch<SetStateAction<number>>
  children: ReactNode
}

function WithComponentIframeHeight({ setHeight, children }: WithComponentIframeHeightPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return

    const observer = new ResizeObserver(() => {
      // Prevent setting 0 as the iframe height
      if (!(rootRef.current && rootRef.current.offsetHeight)) return

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

export default memo(WithComponentIframeHeight)
