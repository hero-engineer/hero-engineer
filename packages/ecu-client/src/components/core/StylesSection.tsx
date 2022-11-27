import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Div } from 'honorable'

import { cssAttributesMap, refetchKeys, spacingSemanticValues } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType, UpdateCssClassMutation, UpdateCssClassMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'

import useQuery from '../../hooks/useQuery'
import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'
import useCssValues from '../../hooks/useCssValues'
import useJsCssValues from '../../hooks/useJsCssValues'
import useThrottleAsynchronous from '../../hooks/useThrottleAsynchronous'

import filterClassesByClassNames from '../../utils/filterClassesByClassNames'
import convertCssAttributeNameToJs from '../../utils/convertCssAttributeNameToJs'
import removeCssDefaults from '../../utils/removeCssDefaults'

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
  const [, updateCssClass] = useMutation<UpdateCssClassMutationDataType>(UpdateCssClassMutation)

  const refetch = useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  const classNames = useMemo(() => className.split(' ').map(c => c.trim()).filter(Boolean), [className])

  const [currentClassIndex, setCurrentClassIndex] = useState(classNames.length - 1)
  const [combine, setCombine] = useState(false)
  const [loading, setLoading] = useState(false)

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const classes = useMemo(() => filterClassesByClassNames(allClasses, classNames), [allClasses, classNames])
  const currentClass = useMemo(() => filterClassesByClassNames(allClasses, combine ? classNames : [classNames[currentClassIndex]]), [allClasses, combine, classNames, currentClassIndex])
  const hasNoNodeSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot, [hierarchy])
  const cssValues = useCssValues(classes, cssAttributesMap)
  const currentCssValues = useCssValues(currentClass, cssAttributesMap)
  const finalCssValues = useJsCssValues(cssValues, updatedStyles, cssAttributesMap)
  const workingCssValues = useJsCssValues(currentCssValues, updatedStyles, cssAttributesMap)

  const margin = useMemo(() => spacingSemanticValues.map(spacingSemanticValue => `margin-${spacingSemanticValue}`).map(key => finalCssValues[key] ?? cssAttributesMap[key].defaultValue) as SpacingsType, [finalCssValues])
  const padding = useMemo(() => spacingSemanticValues.map(spacingSemanticValue => `padding-${spacingSemanticValue}`).map(key => finalCssValues[key] ?? cssAttributesMap[key].defaultValue) as SpacingsType, [finalCssValues])

  const handleCssUpdate = useCallback(async () => {
    if (!classNames.length) return

    const attributes = Object.entries(removeCssDefaults(workingCssValues, cssAttributesMap)).map(([name, value]) => ({ name, value }))
    const workingClassNames = combine ? classNames : [classNames[currentClassIndex]]

    await updateCssClass({
      classNames: workingClassNames,
      attributesJson: JSON.stringify(attributes),
    })

    setTimeout(() => {
      setUpdatedStyles({})
    }, 500)

    refetch(refetchKeys.cssClasses)
  }, [
    updateCssClass,
    workingCssValues,
    combine,
    classNames,
    currentClassIndex,
    setUpdatedStyles,
    refetch,
  ])

  const throttledHandleCssUpdate = useThrottleAsynchronous(handleCssUpdate, 333)

  const handleSetClassNames = useCallback((classes: string[]) => {
    setClassName(classes.join(' '))
    setUpdatedStyles({})
  }, [setClassName, setUpdatedStyles])

  const handleStyleChange = useCallback((attributeName: string, value: string) => {
    const jsAttributeName = convertCssAttributeNameToJs(attributeName)

    setUpdatedStyles(x => ({ ...x, [jsAttributeName]: value }))
  }, [setUpdatedStyles])

  const renderNoElement = useCallback(() => (
    <Div
      color="text-light"
      fontSize="0.85rem"
      px={0.5}
    >
      No element selected
    </Div>
  ), [])

  const renderNoClassNames = useCallback(() => (
    <Div
      color="text-light"
      fontSize="0.85rem"
      mt={0.5}
      px={0.5}
    >
      Start by adding a class to your component
    </Div>
  ), [])

  const renderSubSections = useCallback(() => (
    <Div position="relative">
      <StylesSpacingSection
        marging={margin}
        padding={padding}
        onMarginChange={value => handleStyleChange('margin', value.join(' '))}
        onPaddingChange={value => handleStyleChange('padding', value.join(' '))}
        workingCssValues={workingCssValues}
      />
      {loading && (
        <Div
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="transparency(black, 75)"
        />
      )}
    </Div>
  ), [
    margin,
    padding,
    handleStyleChange,
    workingCssValues,
    loading,
  ])

  const renderSection = useCallback(() => (
    <>
      <Div
        xflex="x4"
        px={0.5}
      >
        <CssClassesSelector
          allClasses={allClasses}
          classNames={classNames}
          currentClassIndex={currentClassIndex}
          setCurrentClassIndex={setCurrentClassIndex}
          combine={combine}
          setCombine={setCombine}
          setLoading={setLoading}
          onClassesChange={handleSetClassNames}
        />
      </Div>
      {!classNames.length ? renderNoClassNames() : renderSubSections()}
    </>
  ), [
    allClasses,
    classNames,
    combine,
    handleSetClassNames,
    renderNoClassNames,
    renderSubSections,
    currentClassIndex,
    setCurrentClassIndex,
  ])

  useEffect(() => {
    if (!Object.keys(updatedStyles).length) return

    throttledHandleCssUpdate()
  // Adding throttledHandleCssUpdate as a dep seems to cause infinite useEffect trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedStyles])

  useEffect(() => {
    setCurrentClassIndex(classNames.length - 1)
  }, [classNames])

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
      {hasNoNodeSelected ? renderNoElement() : renderSection()}
    </Div>
  )
}

export default memo(StylesSection)
