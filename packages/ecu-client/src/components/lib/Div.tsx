import { HTMLProps, Ref, forwardRef } from 'react'

import useEditionProps from '@hooks/useEditionProps'
import useForkedRef from '@hooks/useForkedRef'

type DivPropsType = HTMLProps<HTMLDivElement> & {
  'data-ecu': string
}

// A div component
// TODO use a preprocessor before production build to replace Div with a regular Div
function DivRef({ 'data-ecu': ecuId, className, children }: DivPropsType, ref: Ref<any>) {
  const {
    ref: editionRef,
    editionProps,
  } = useEditionProps<HTMLDivElement>(ecuId, className)

  const finalRef = useForkedRef(ref, editionRef)

  return (
    <div
      ref={finalRef}
      {...editionProps}
    >
      {children}
    </div>
  )
}

export default forwardRef(DivRef)
