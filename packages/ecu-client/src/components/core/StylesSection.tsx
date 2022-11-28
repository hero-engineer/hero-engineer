import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Div, Tooltip } from 'honorable'

import { cssAttributesMap, refetchKeys } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType, UpdateCssClassMutation, UpdateCssClassMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'
import HotContext from '../../contexts/HotContext'

import useQuery from '../../hooks/useQuery'
import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'
import useCssValues from '../../hooks/useCssValues'
import useJsCssValues from '../../hooks/useJsCssValues'
import useThrottleAsynchronous from '../../hooks/useThrottleAsynchronous'

import filterClassesByClassNames from '../../utils/filterClassesByClassNames'
import convertCssAttributeNameToJs from '../../utils/convertCssAttributeNameToJs'
import removeCssDefaults from '../../utils/removeCssDefaults'

import { CssAttributeType, CssValueType } from '../../types'

import usePersistedState from '../../hooks/usePersistedState'

import CssClassesSelector from './CssClassesSelector'
import StylesLayoutSection from './StylesLayoutSection'
import StylesSpacingSection from './StylesSpacingSection'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { hierarchy } = useContext(HierarchyContext)
  const { className, setClassName, updatedStyles, setUpdatedStyles } = useContext(CssClassesContext)
  const hot = useContext(HotContext)
  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })
  const [, updateCssClass] = useMutation<UpdateCssClassMutationDataType>(UpdateCssClassMutation)

  const refetch = useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  const classNames = useMemo(() => className.split(' ').map(c => c.trim()).filter(Boolean), [className])

  const [selectedClassName, setSelectedClassName] = usePersistedState('styles-section-selected-class-name', '')
  const [loading, setLoading] = useState(false)

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const classes = useMemo(() => filterClassesByClassNames(allClasses, classNames), [allClasses, classNames])
  const currentClass = useMemo(() => filterClassesByClassNames(classes, [selectedClassName]), [classes, selectedClassName])
  const hasNoNodeSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot, [hierarchy])
  const finalCssValues = useJsCssValues(useCssValues(classes, cssAttributesMap), updatedStyles, cssAttributesMap)
  const workingCssValues = useJsCssValues(useCssValues(currentClass, cssAttributesMap), updatedStyles, cssAttributesMap)

  const handleCssUpdate = useCallback(async () => {
    if (!classNames.length) return

    const attributes = Object.entries(removeCssDefaults(workingCssValues, cssAttributesMap)).map(([name, value]) => ({ name, value }))

    await updateCssClass({
      classNames: selectedClassName,
      attributesJson: JSON.stringify(attributes),
    })

    refetch(refetchKeys.cssClasses)
  }, [
    updateCssClass,
    workingCssValues,
    selectedClassName,
    classNames,
    refetch,
  ])

  const throttledHandleCssUpdate = useThrottleAsynchronous(handleCssUpdate, 500)

  const handleSetClassNames = useCallback((classes: string[]) => {
    setClassName(classes.join(' '))
    setUpdatedStyles({})
  }, [setClassName, setUpdatedStyles])

  const handleStyleChange = useCallback((attributes: CssAttributeType[]) => {
    const updatedStyles: Record<string, CssValueType> = {}

    attributes.forEach(({ name, value }) => {
      updatedStyles[convertCssAttributeNameToJs(name)] = value
    })

    setUpdatedStyles(x => ({ ...x, ...updatedStyles }))
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
    <Div
      xflex="y2s"
      position="relative"
      borderTop="1px solid border"
      mt={0.5}
    >
      <StylesLayoutSection
        cssValues={selectedClassName ? workingCssValues : finalCssValues}
        onChange={handleStyleChange}
      />
      <StylesSpacingSection
        cssValues={selectedClassName ? workingCssValues : finalCssValues}
        onChange={handleStyleChange}
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
      {!selectedClassName && (
        <Tooltip
          label={(
            <Div textAlign="center">
              Select a class to edit it.
              <br />
              This is your styling including all classes.
            </Div>
          )}
        >
          <Div
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="transparency(black, 98)"
          />
        </Tooltip>
      )}
    </Div>
  ), [
    selectedClassName,
    workingCssValues,
    finalCssValues,
    loading,
    handleStyleChange,
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
          selectedClassName={selectedClassName}
          setSelectedClassName={setSelectedClassName}
          setLoading={setLoading}
          onClassesChange={handleSetClassNames}
        />
      </Div>
      {!classNames.length ? renderNoClassNames() : renderSubSections()}
    </>
  ), [
    allClasses,
    classNames,
    selectedClassName,
    setSelectedClassName,
    handleSetClassNames,
    renderNoClassNames,
    renderSubSections,
  ])

  useEffect(() => {
    if (!Object.keys(updatedStyles).length) return

    throttledHandleCssUpdate()
  // Adding throttledHandleCssUpdate as a dep seems to cause infinite useEffect trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedStyles])

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        setTimeout(() => {
          setUpdatedStyles({})
        }, 500)
      })
    }
  }, [hot, setUpdatedStyles])

  return (
    <Div
      xflex="y2s"
      width={256}
    >
      <Div
        fontWeight="bold"
        p={0.5}
      >
        Styles
      </Div>
      {hasNoNodeSelected ? renderNoElement() : renderSection()}
    </Div>
  )
}

export default memo(StylesSection)
