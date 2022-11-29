import { ReactElement, memo, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

import useRefresh from '../../hooks/useRefresh'

type ComponentIframeChildrenArgsType = {
  window?: Window | null
  head?: HTMLHeadElement
}

type ComponentIframePropsType = Omit<IframeProps, 'children'> & {
  children: (args: ComponentIframeChildrenArgsType) => ReactElement
}

function ComponentIframe({ children, ...props }: ComponentIframePropsType) {
  const rootRef = useRef<HTMLIFrameElement>(null)

  useRefresh()

  const [height, setHeight] = useState(0)

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

  // To allow borders to be visible
  // And the iframe to have the component height
  useEffect(() => {
    appendCss(`
      html {
        height: fit-content;
      }
      body {
        padding: 1px;
        height: fit-content;
      }
    `)
  }, [appendCss])

  useEffect(() => {
    if (!mountNode) return

    const observer = new ResizeObserver(() => {
      setHeight(mountNode.scrollHeight)
    })

    observer.observe(mountNode)

    return () => {
      observer.disconnect()
    }
  }, [mountNode])

  return (
    <Iframe
      {...props}
      ref={rootRef}
      width="100%"
      height={height}
      minHeight={0}
      border="none"
      userSelect="none"
      position="relative" // For Tooltip to be over the iframe
      zIndex={0} // Idem
    >
      {mountNode && createPortal(children({ window: windowNode, head: headNode }), mountNode)}
    </Iframe>
  )
}

export default memo(ComponentIframe)
