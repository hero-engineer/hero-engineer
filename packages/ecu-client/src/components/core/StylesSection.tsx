import { memo, useCallback, useContext, useMemo } from 'react'
import { Div } from 'honorable'
import throttleAsynchronous from 'throttle-asynchronous'

import { cssAttributesMap, refetchKeys, spacingSemanticValues } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'

import useQuery from '../../hooks/useQuery'
import useRefetch from '../../hooks/useRefetch'
import useCssValues from '../../hooks/useCssValues'
import useJsCssValues from '../../hooks/useJsCssValues'

import filterClassesByClassNames from '../../utils/filterClassesByClassNames'
import convertCssAttributeNameToJs from '../../utils/convertCssAttributeNameToJs'

import { SpacingsType } from '../../types'

import CssClassesSelector from './CssClassesSelector'
import StylesSpacingSection from './StylesSpacingSection'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { hierarchy } = useContext(HierarchyContext)
  const { className, setClassName, updatedStyles, setUpdatedStyles } = useContext(CssClassesContext)

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })

  const classNames = useMemo(() => className.split(' ').map(c => c.trim()).filter(Boolean), [className])
  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const classes = useMemo(() => filterClassesByClassNames(allClasses, classNames), [allClasses, classNames])
  const hasNoNodeSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot, [hierarchy])
  const cssValues = useCssValues(classes, cssAttributesMap)
  const finalCssValues = useJsCssValues(cssValues, updatedStyles, cssAttributesMap)

  const margin = useMemo(() => spacingSemanticValues.map(spacingSemanticValue => `margin-${spacingSemanticValue}`).map(key => finalCssValues[key] ?? cssAttributesMap[key].defaultValue) as SpacingsType, [finalCssValues])
  const padding = useMemo(() => spacingSemanticValues.map(spacingSemanticValue => `padding-${spacingSemanticValue}`).map(key => finalCssValues[key] ?? cssAttributesMap[key].defaultValue) as SpacingsType, [finalCssValues])

  const handleCssUpdate = useCallback(() => {
    console.log('handleCssUpdate')
  }, [])

  const throttledHandleCssUpdate = useMemo(() => throttleAsynchronous(handleCssUpdate, 1000), [handleCssUpdate])

  const handleSetClassNames = useCallback((classes: string[]) => {
    setClassName(classes.join(' '))
    setUpdatedStyles({})
  }, [setClassName, setUpdatedStyles])

  const handleStyleChange = useCallback((attributeName: string, value: string) => {
    const jsAttributeName = convertCssAttributeNameToJs(attributeName)

    setUpdatedStyles(x => ({ ...x, [jsAttributeName]: value }))
    throttledHandleCssUpdate()
  }, [setUpdatedStyles, throttledHandleCssUpdate])

  const renderSection = useCallback(() => (
    <>
      <Div
        xflex="x4"
        px={0.5}
      >
        <CssClassesSelector
          allClasses={allClasses}
          classNames={classNames}
          onClassesChange={handleSetClassNames}
        />
      </Div>
      <StylesSpacingSection
        marging={margin}
        padding={padding}
        onMarginChange={value => handleStyleChange('margin', value.join(' '))}
        onPaddingChange={value => handleStyleChange('padding', value.join(' '))}
      />
    </>
  ), [allClasses, classNames, margin, padding, handleSetClassNames, handleStyleChange])

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
