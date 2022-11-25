import { ReactElement, memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Iframe, IframeProps } from 'honorable'

import editionStyles from '../../css/edition.css?inline'

import BreakpointContext from '../../contexts/BreakpointContext'

type ComponentIframeChildrenArgsType = {
  window?: Window | null
  head?: HTMLHeadElement
}

type ComponentIframePropsType = Omit<IframeProps, 'children'> & {
  children: (args: ComponentIframeChildrenArgsType) => ReactElement
}

function ComponentIframe({ children, ...props }: ComponentIframePropsType) {
  const rootRef = useRef<HTMLIFrameElement>(null)

  const { isDragging } = useContext(BreakpointContext)

  const [height, setHeight] = useState(0)
  const [, setRefresh] = useState(false)

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
      console.log('≈', mountNode.scrollHeight)
      setHeight(mountNode.scrollHeight)
    })

    observer.observe(mountNode)

    return () => {
      observer.disconnect()
    }
  }, [mountNode])

  // Refresh for mountNode to be populated
  useEffect(() => {
    setRefresh(x => !x)
  }, [])

  return (
    <Iframe
      {...props}
      ref={rootRef}
      width="100%"
      height={height}
      minHeight={0}
      border="none"
      pointerEvents={isDragging ? 'none' : undefined}
      userSelect="none"
    >
      {mountNode && createPortal(children({ window: windowNode, head: headNode }), mountNode)}
    </Iframe>
  )
}

export default memo(ComponentIframe)
