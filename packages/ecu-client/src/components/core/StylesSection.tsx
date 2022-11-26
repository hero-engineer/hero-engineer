import { memo, useCallback, useContext, useMemo } from 'react'
import { Div } from 'honorable'

import { refetchKeys } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'

import useQuery from '../../hooks/useQuery'
import useRefetch from '../../hooks/useRefetch'

import CssClassesSelector from './CssClassesSelector'
import StylesSpacingSection from './StylesSpacingSection'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { hierarchy } = useContext(HierarchyContext)
  const { className, updatedClassName, setUpdatedClassName } = useContext(CssClassesContext)

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const classes = useMemo(() => (updatedClassName || className) ? (updatedClassName !== null ? updatedClassName : className).split(' ').map(c => c.trim()).filter(Boolean) : [], [updatedClassName, className])
  const hasNoNodeSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot, [hierarchy])

  const handleSetClasses = useCallback((classes: string[]) => {
    setUpdatedClassName(classes.join(' '))
  }, [setUpdatedClassName])

  const renderSection = useCallback(() => (
    <>
      <Div
        xflex="x4"
        px={0.5}
      >
        <CssClassesSelector
          allClasses={allClasses}
          classes={classes}
          onClassesChange={handleSetClasses}
        />
      </Div>
      <StylesSpacingSection
        margings={[0, 0, 0, 0]}
        paddings={[0, 0, 0, 0]}
        onMarginChange={() => {}}
        onPaddingChange={() => {}}
      />
    </>
  ), [allClasses, classes, handleSetClasses])

  useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  return (
    <Div
      xflex="y2s"
      width={256}
      py={0.5}
    >
      <Div
        fontWeight="bold"
        mb={0.5}
        px={0.5}
      >
        Styles
      </Div>
      {hasNoNodeSelected ? 'No element selected' : renderSection()}
    </Div>
  )
}

export default memo(StylesSection)
