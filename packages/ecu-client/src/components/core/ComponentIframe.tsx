import { ReactElement, Ref, RefObject, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps, useForkedRef } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

import EmotionProvider from './EmotionProvider'

type ComponentIframeChildrenArgsType = {
  window?: Window | null
}

type ComponentIframePropsType = Omit<IframeProps, 'children'> & {
  children: (args: ComponentIframeChildrenArgsType) => ReactElement
  componentRef: RefObject<HTMLDivElement>
}

function ComponentIframe({ children, componentRef, ...props }: ComponentIframePropsType, ref: Ref<HTMLIFrameElement>) {
  const rootRef = useRef<HTMLIFrameElement>(null)
  const forkedRef = useForkedRef(ref, rootRef)

  const [height, setHeight] = useState<number | 'auto'>('auto')

  const windowNode = rootRef.current?.contentWindow
  const documentNode = windowNode?.document
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
  // And ovrflow auto for scroll to work
  useEffect(() => {
    appendCss(`
      body {
        overflow: auto;
        padding: 1px;
      }
    `)
  }, [appendCss])

  useEffect(() => {
    if (!componentRef.current) return

    const observer = new ResizeObserver(() => {
      setHeight(componentRef.current!.scrollHeight)
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
        {mountNode && createPortal(children({ window: windowNode }), mountNode)}
      </EmotionProvider>
    </Iframe>
  )
}

export default forwardRef(ComponentIframe)
