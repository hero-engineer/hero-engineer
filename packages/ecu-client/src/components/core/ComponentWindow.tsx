import { useRef } from 'react'
import { Div } from 'honorable'

import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'
import ContextualInformation from './ContextualInformation'

type ComponentWindowPropsType = {
  componentPath: string
}

function ComponentWindow({ componentPath }: ComponentWindowPropsType) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  return (
    <>
      <Div
        ref={scrollRef}
        xflex="y2s"
        flexGrow
      >
        <ComponentIframe ref={iframeRef}>
          <WithIsComponentRefreshingLayer>
            <ComponentLoader componentPath={componentPath} />
          </WithIsComponentRefreshingLayer>
        </ComponentIframe>
      </Div>
      <ContextualInformation
        scrollRef={scrollRef}
        iframeRef={iframeRef}
      />
    </>
  )
}

export default ComponentWindow
