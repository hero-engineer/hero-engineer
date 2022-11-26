import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { Div } from 'honorable'

import { refetchKeys } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'

import useQuery from '../../hooks/useQuery'

import useRefetch from '../../hooks/useRefetch'

import CssClassesSelector from './CssClassesSelector'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { hierarchy } = useContext(HierarchyContext)
  const [classes, setClasses] = useState<string[]>([])

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })

  console.log('cssClassesQueryResult.data', cssClassesQueryResult.data)

  const hasNoNodeSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot, [hierarchy])

  const renderSection = useCallback(() => (
    <CssClassesSelector
      classes={classes}
      setClasses={setClasses}
    />
  ), [classes])

  useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  return (
    <Div
      xflex="y2s"
      width={256}
      p={0.5}
    >
      <Div
        fontWeight="bold"
        mb={0.5}
      >
        Styles
      </Div>
      {hasNoNodeSelected ? 'No element selected' : renderSection()}
    </Div>
  )
}

export default memo(StylesSection)
