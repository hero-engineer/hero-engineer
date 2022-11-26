import { memo, useCallback, useContext, useMemo } from 'react'
import { Div } from 'honorable'

import { refetchKeys } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'

import useQuery from '../../hooks/useQuery'

import useRefetch from '../../hooks/useRefetch'

import CssClassesSelector from './CssClassesSelector'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { hierarchy } = useContext(HierarchyContext)
  const { className } = useContext(CssClassesContext)

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })

  console.log('className', className)

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const classes = useMemo(() => className ? className.split(' ').map(x => x.trim()) : [], [className])
  const hasNoNodeSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot, [hierarchy])

  const renderSection = useCallback(() => (
    <CssClassesSelector
      allClasses={allClasses}
      classes={classes}
      setClasses={() => {}}
    />
  ), [allClasses, classes])

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
