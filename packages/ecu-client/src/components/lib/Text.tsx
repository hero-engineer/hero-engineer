import { PropsWithChildren, memo } from 'react'

import useEditionProps from '../../hooks/useEditionProps'
import useHierarchyId from '../../hooks/useHierarchyId'

type TextProps = PropsWithChildren<{
  'data-ecu': string
  className?: string
}>

// TODO use a preprocessor before production build to replace Text with a regular Text
function Text({ 'data-ecu': ecuId, className, children }: TextProps) {
  const hierarchyId = useHierarchyId(ecuId)
  const editionProps = useEditionProps(hierarchyId)

  return (
    <span
      className={className}
      data-ecu={hierarchyId}
      {...editionProps}
    >
      {children}
    </span>
  )
}

export default memo(Text)
