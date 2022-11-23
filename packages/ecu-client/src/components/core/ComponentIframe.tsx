
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

type ComponentIframePropsType = IframeProps & {
  children: ReactNode
}

function ComponentIframe({ children, ...props }: ComponentIframePropsType) {
  const rootRef = useRef<HTMLIFrameElement>(null)

  console.log('editionStyles', editionStyles)
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

  return (
    <Iframe
      {...props}
      ref={rootRef}
      flexGrow
      width="100%"
      height="100%"
      border="none"
    >
      {mountNode && createPortal(children, mountNode)}
    </Iframe>
  )
}

export default ComponentIframe
