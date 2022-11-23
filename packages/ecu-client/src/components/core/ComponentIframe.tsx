import { ReactNode, Ref, forwardRef, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps, useForkedRef, useGlobalStyles } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

type ComponentIframePropsType = IframeProps & {
  children: ReactNode
}

function ComponentIframe({ children, ...props }: ComponentIframePropsType, ref: Ref<HTMLIFrameElement>) {
  const rootRef = useRef<HTMLIFrameElement>(null)
  const forkedRef = useForkedRef(ref, rootRef)

  const globalStyles = useGlobalStyles()

  const documentNode = rootRef.current?.contentWindow?.document
  const mountNode = documentNode?.body

  const appendCss = useCallback((css: string) => {
    if (!documentNode) return

    const cssLink = document.createElement('style')

    cssLink.innerHTML = css

    documentNode.head.appendChild(cssLink)
  }, [documentNode])

  useEffect(() => {
    appendCss(editionStyles)
  }, [appendCss])

  useEffect(() => {
    globalStyles.forEach(({ styles }) => {
      appendCss(styles)
    })
  }, [globalStyles, appendCss])

  // To allow borders to be visible
  useEffect(() => {
    appendCss(`
      body {
        padding: 1px;
      }
    `)
  }, [appendCss])

  return (
    <Iframe
      {...props}
      ref={forkedRef}
      flexGrow
      width="100%"
      height="100%"
      border="none"
    >
      {mountNode && createPortal(children, mountNode)}
    </Iframe>
  )
}

export default forwardRef(ComponentIframe)
