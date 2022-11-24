import { ReactNode, Ref, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps, useForkedRef } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

import EmotionProvider from './EmotionProvider'

type ComponentIframePropsType = IframeProps & {
  children: ReactNode
}

function ComponentIframe({ children, ...props }: ComponentIframePropsType, ref: Ref<HTMLIFrameElement>) {
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

  // To allow borders to be visible
  useEffect(() => {
    appendCss(`
      body {
        padding: 1px;
      }
    `)
  }, [appendCss])

  useEffect(() => {
    if (!mountNode) return

    const observer = new ResizeObserver(() => {
      setHeight(mountNode.scrollHeight)
    })

    observer.observe(mountNode)
  }, [mountNode])

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
