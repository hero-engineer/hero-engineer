import { PropsWithChildren, memo } from 'react'

import useEditionProps from '../../hooks/useEditionProps'
import useHierarchyId from '../../hooks/useHierarchyId'

type DivProps = PropsWithChildren<{
  'data-ecu': string
  className?: string
}>

// TODO use a preprocessor before production build to replace Div with a regular Div
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
