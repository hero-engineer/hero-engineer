import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Div, useDebounce } from 'honorable'

import { CssAttributeType, CssValuesType } from '../../types'
import { cssAttributesMap, refetchKeys } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType, UpdateCssClassMutation, UpdateCssClassMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'
import BreakpointContext from '../../contexts/BreakpointContext'
import HotContext from '../../contexts/HotContext'

import useQuery from '../../hooks/useQuery'
import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'
import useCssValues from '../../hooks/useCssValues'
import useJsCssValues from '../../hooks/useJsCssValues'
import useThrottleAsynchronous from '../../hooks/useThrottleAsynchronous'
import usePersistedState from '../../hooks/usePersistedState'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'

import getComponentRootHierarchyIds from '../../utils/getComponentRootHierarchyIds'

import convertCssAttributeNameToJs from '../../utils/convertCssAttributeNameToJs'
import filterClassesByClassNamesAndMedia from '../../utils/filterClassesByClassNamesAndMedia'
import filterInvalidCssValues from '../../utils/filterInvalidCssValues'
import getLastComponentHierarchyItem from '../../utils/getLastComponentHierarchyItem'
import removeCssDefaults from '../../utils/removeCssDefaults'

import CssClassesSelector from './CssClassesSelector'
import StylesSubSectionLayout from './StylesSubSectionLayout'
import StylesSubSectionSpacing from './StylesSubSectionSpacing'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { hierarchy } = useContext(HierarchyContext)
  const { componentDelta, hierarchyIds } = useEditionSearchParams()
  const { className, setClassName, style, setStyle } = useContext(CssClassesContext)
  const { breakpoint } = useContext(BreakpointContext)
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

  const lastComponentHierarchyItem = useMemo(() => getLastComponentHierarchyItem(hierarchy), [hierarchy])
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isSomeNodeSelected = useMemo(() => hierarchy.length > 0, [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyIds[hierarchyIds.length - 1]), [componentDelta, componentRootHierarchyIds, hierarchyIds])
  const isOnAnotherComponent = useMemo(() => !hierarchy.length || (!!hierarchy[hierarchy.length - 1].componentAddress && !hierarchy[hierarchy.length - 1].isRoot), [hierarchy])
  const isNoElementSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot || isComponentRoot || isOnAnotherComponent, [hierarchy, isComponentRoot, isOnAnotherComponent])
  const debouncedIsNoElementSelected = useDebounce(isNoElementSelected, 6 * 16) // To prevent flickering of the section
  const debouncedIsOnAnotherComponent = useDebounce(isSomeNodeSelected && isOnAnotherComponent, 6 * 16) // To prevent flickering of the section

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const baseClasses = useMemo(() => filterClassesByClassNamesAndMedia(allClasses, classNames, ''), [allClasses, classNames])
  const currentBaseClass = useMemo(() => filterClassesByClassNamesAndMedia(baseClasses, [selectedClassName], ''), [baseClasses, selectedClassName])
  const breakpointClasses = useMemo(() => filterClassesByClassNamesAndMedia(allClasses, classNames, breakpoint.media), [allClasses, classNames, breakpoint])
  const currentBreakpointClass = useMemo(() => filterClassesByClassNamesAndMedia(allClasses, [selectedClassName], breakpoint.media), [allClasses, selectedClassName, breakpoint])

  const finalBaseCssValues = useJsCssValues(useCssValues(baseClasses, cssAttributesMap), style, cssAttributesMap)
  const workingBaseCssValues = useJsCssValues(useCssValues(currentBaseClass, cssAttributesMap), style, cssAttributesMap)
  const finalBreakpointCssValues = useJsCssValues(useCssValues(breakpointClasses, cssAttributesMap), style, cssAttributesMap)
  const workingBreakpointCssValues = useJsCssValues(useCssValues(currentBreakpointClass, cssAttributesMap), style, cssAttributesMap)

  const handleCssUpdate = useCallback(async () => {
    if (!classNames.length) return

    const attributes = Object.entries(filterInvalidCssValues(removeCssDefaults(workingBaseCssValues, cssAttributesMap), cssAttributesMap)).map(([name, value]) => ({ name, value }))

    console.log('attributes', attributes)

    if (!attributes.length) return

    await updateCssClass({
      classNames: selectedClassName,
      attributesJson: JSON.stringify(attributes),
      breakpointId: breakpoint.id,
    })

    refetch(refetchKeys.cssClasses)
  }, [
    classNames,
    workingBaseCssValues,
    selectedClassName,
    breakpoint,
    updateCssClass,
    refetch,
  ])

  const throttledHandleCssUpdate = useThrottleAsynchronous(handleCssUpdate, 500)

  const handleSetClassNames = useCallback((classes: string[]) => {
    setClassName(classes.join(' ') || ' ') // HACK to force useEditionProps to use an empty updated className
    setStyle({})
  }, [setClassName, setStyle])

  const handleStyleChange = useCallback((attributes: CssAttributeType[]) => {
    if (!selectedClassName) return

    const updatedStyles: CssValuesType = {}

    attributes.forEach(({ name, value }) => {
      updatedStyles[convertCssAttributeNameToJs(name)] = value
    })

    setStyle(x => ({ ...x, ...updatedStyles }))
  }, [selectedClassName, setStyle])

  const renderNoElement = useCallback(() => (
    <Div
      px={0.5}
      fontSize="0.85rem"
    >
      {debouncedIsOnAnotherComponent ? (
        <>
          <Div color="text-light">
            To style this element you must edit its parent component
          </Div>
          {!!lastComponentHierarchyItem && (
            <Button
              as={Link}
              to={`/_ecu_/component/${lastComponentHierarchyItem.fileAddress}/${lastComponentHierarchyItem.componentAddress}`}
              mt={0.5}
            >
              Edit
              {' '}
              {lastComponentHierarchyItem.componentName}
            </Button>
          )}
        </>
      ) : (
        <Div color="text-light">
          No element selected
        </Div>
      )}
    </Div>
  ), [debouncedIsOnAnotherComponent, lastComponentHierarchyItem])

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
      mt={0.5}
    >
      {!selectedClassName && (
        <Div
          textAlign="center"
          fontSize="0.75rem"
          color="text-light"
          mb={0.5}
        >
          Select a class to edit it.
          <br />
          This is your styling including all classes.
        </Div>
      )}
      <StylesSubSectionLayout
        cssValues={selectedClassName ? workingBaseCssValues : finalBaseCssValues}
        breakpointCssValues={selectedClassName ? workingBreakpointCssValues : finalBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionSpacing
        cssValues={selectedClassName ? workingBaseCssValues : finalBaseCssValues}
        breakpointCssValues={selectedClassName ? workingBreakpointCssValues : finalBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
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
    selectedClassName,
    workingBaseCssValues,
    finalBaseCssValues,
    workingBreakpointCssValues,
    finalBreakpointCssValues,
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
          onClassNamesChange={handleSetClassNames}
          selectedClassName={selectedClassName}
          onSelectedClassNameChange={setSelectedClassName}
          onLoading={setLoading}
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
    if (!Object.keys(style).length) return

    throttledHandleCssUpdate()
  // Adding throttledHandleCssUpdate as a dep seems to cause infinite useEffect trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style])

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        setTimeout(() => {
          setStyle({})
        }, 500)
      })
    }
  }, [hot, setStyle])

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
      {debouncedIsNoElementSelected ? renderNoElement() : renderSection()}
    </Div>
  )
}

export default memo(StylesSection)
