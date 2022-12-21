import { Dispatch, ReactElement, SetStateAction, memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Iframe } from 'honorable'

import BreakpointContext from '~contexts/BreakpointContext'

import useRefresh from '~hooks/useRefresh'

type ComponentIframeChildrenArgsType = {
  window: Window | null
  head: HTMLHeadElement | null
  setHeight: Dispatch<SetStateAction<number>>
}

type ComponentIframePropsType = {
  children: (args: ComponentIframeChildrenArgsType) => ReactElement
}

function ComponentIframe({ children }: ComponentIframePropsType) {
  const rootRef = useRef<HTMLIFrameElement>(null)

  useRefresh()

  const { width, height } = useContext(BreakpointContext)

  const [baseHeight, setBaseHeight] = useState(0)

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

  // Allow the iframe to have the component height
  useEffect(() => {
    appendCss(`
      html {
        height: fit-content;
        background-color: white;
      }
      body {
        height: fit-content;
        margin: 0;
      }
    `)
  }, [appendCss])

  return (
    <Iframe
      ref={rootRef}
      width={width}
      height={height ?? baseHeight}
      minHeight={0}
      border="none"
      position="relative" // For Tooltip to be over the iframe
      zIndex={0} // Idem
    >
      {mountNode && createPortal(children({ window: windowNode ?? null, head: headNode ?? null, setHeight: setBaseHeight }), mountNode)}
    </Iframe>
  )
}

export default memo(ComponentIframe)
