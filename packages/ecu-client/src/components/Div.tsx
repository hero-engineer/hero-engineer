import { PropsWithChildren, memo } from 'react'

import useHierarchyId from '../hooks/useHierarchyId'
import useEditionProps from '../hooks/useEditionProps'

type DivProps = PropsWithChildren<{
  'data-ecu': string
  className?: string
}>

// TODO use a preprocessor before production build to replace Div with a regular div
function Div({ 'data-ecu': ecuId, className, children }: DivProps) {
  const hierarchyId = useHierarchyId(ecuId)
  const editionProps = useEditionProps(hierarchyId)

  return (
    <div
      className={className}
      data-ecu={hierarchyId}
      {...editionProps}
    >
      {children}
    </div>
  )
}

export default memo(Div)
