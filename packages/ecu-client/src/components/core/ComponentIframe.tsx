import { ReactNode, Ref, RefObject, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps, useForkedRef } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

import EmotionProvider from './EmotionProvider'

type ComponentIframePropsType = IframeProps & {
  children: ReactNode
  componentRef: RefObject<HTMLDivElement>
}

function ComponentIframe({ children, componentRef, ...props }: ComponentIframePropsType, ref: Ref<HTMLIFrameElement>) {
  const rootRef = useRef<HTMLIFrameElement>(null)
  const forkedRef = useForkedRef(ref, rootRef)

  const [height, setHeight] = useState<number | 'auto'>('auto')
  const documentNode = rootRef.current?.contentWindow?.document
  const mountNode = documentNode?.body
  const headNode = documentNode?.head

  const appendCss = useCallback((css: string) => {
    if (!documentNode) return

    const cssLink = document.createElement('style')

    cssLink.innerHTML = css

    documentNode.head.appendChild(cssLink)
  }, [documentNode])

  useEffect(() => {
    appendCss(editionStyles)
  }, [appendCss])

  // To allow borders and component vignette to be visible
  useEffect(() => {
    appendCss(`
      body {
        padding-top: 16px;
        padding-bottom: 1xp;
        padding-left: 1px;
        padding-right: 1px;
      }
    `)
  }, [appendCss])

  useEffect(() => {
    if (!componentRef.current) return

    const observer = new ResizeObserver(() => {
      setHeight(componentRef.current!.scrollHeight + 16 + 1)
    })

    observer.observe(componentRef.current)

    return () => {
      observer.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentRef.current])

  return (
    <Iframe
      {...props}
      ref={forkedRef}
      flexGrow
      width="100%"
      height={height}
      border="none"
    >
      <EmotionProvider head={headNode}>
        {mountNode && createPortal(children, mountNode)}
      </EmotionProvider>
    </Iframe>
  )
}

export default forwardRef(ComponentIframe)
