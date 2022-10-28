import { PropsWithChildren, Ref, forwardRef } from 'react'

import useEditionProps from '../../hooks/useEditionProps'
import useForkedRef from '../../hooks/useForkedRef'

type DivProps = PropsWithChildren<{
  'data-ecu': string
  className?: string
}>

// TODO use a preprocessor before production build to replace Div with a regular Div
function DivRef({ 'data-ecu': ecuId, className, children }: DivProps, ref: Ref<any>) {
  const { ref: editionRef, hierarchyId, ...editionProps } = useEditionProps<HTMLDivElement>(ecuId)
  const finalRef = useForkedRef(ref, editionRef)

  return (
    <div
      ref={finalRef}
      className={className}
      data-ecu={ecuId}
      data-ecu-hierarchy={hierarchyId}
      {...editionProps}
    >
      {children}
    </div>
  )
}

export default forwardRef(DivRef)
