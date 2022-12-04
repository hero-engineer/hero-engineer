import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Div, usePrevious } from 'honorable'

import { CssAttributeType, CssValuesType } from '../../types'
import { cssAttributesMap, refetchKeys } from '../../constants'

import { CssClassesQuery, CssClassesQueryDataType, UpdateCssClassMutation, UpdateCssClassMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import CssClassesContext from '../../contexts/CssClassesContext'
import BreakpointContext from '../../contexts/BreakpointContext'
import EditionContext from '../../contexts/EditionContext'

import useQuery from '../../hooks/useQuery'
import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'
import useCssValues from '../../hooks/useCssValues'
import useJsCssValues from '../../hooks/useJsCssValues'
import useThrottleAsynchronous from '../../hooks/useThrottleAsynchronous'

import getComponentRootHierarchyIds from '../../utils/getComponentRootHierarchyIds'

import convertCssAttributeNameToJs from '../../utils/convertCssAttributeNameToJs'
import filterClassesByClassNamesAndMedia from '../../utils/filterClassesByClassNamesAndMedia'
import areAttributesValid from '../../utils/areAttributesValid'
import getLastComponentHierarchyItem from '../../utils/getLastComponentHierarchyItem'
import removeCssDefaults from '../../utils/removeCssDefaults'

import CssClassesSelector from './CssClassesSelector'
import StylesSubSectionLayout from './StylesSubSectionLayout'
import StylesSubSectionSpacing from './StylesSubSectionSpacing'
import StylesSubSectionSize from './StylesSubSectionSize'
import StylesSubSectionPosition from './StylesSubSectionPosition'

// The styles section
// Displayed in the right panel
function PanelStyles() {
  const { componentAddress = '' } = useParams()
  const { hierarchy } = useContext(HierarchyContext)
  const { componentDelta, hierarchyId } = useContext(EditionContext)
  const { className, setClassName, selectedClassName, style, setStyle } = useContext(CssClassesContext)
  const { breakpoint } = useContext(BreakpointContext)

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })
  const [, updateCssClass] = useMutation<UpdateCssClassMutationDataType>(UpdateCssClassMutation)

  const refetch = useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  const classNames = useMemo(() => className.split(' ').map(c => c.trim()).filter(Boolean), [className])

  const [loading, setLoading] = useState(false)

  const lastComponentHierarchyItem = useMemo(() => getLastComponentHierarchyItem(hierarchy), [hierarchy])
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyId), [componentDelta, componentRootHierarchyIds, hierarchyId])
  const isOnAnotherComponent = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].onComponentAddress !== componentAddress, [hierarchy, componentAddress])
  const isNoElementSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot || isComponentRoot || isOnAnotherComponent, [hierarchy, isComponentRoot, isOnAnotherComponent])

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const baseClasses = useMemo(() => filterClassesByClassNamesAndMedia(allClasses, classNames, ''), [allClasses, classNames])
  const currentBaseClasses = useMemo(() => filterClassesByClassNamesAndMedia(baseClasses, [selectedClassName], ''), [baseClasses, selectedClassName])
  const breakpointClasses = useMemo(() => filterClassesByClassNamesAndMedia(allClasses, classNames, breakpoint.media), [allClasses, classNames, breakpoint])
  const currentBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedia(allClasses, [selectedClassName], breakpoint.media), [allClasses, selectedClassName, breakpoint])

  // The css values forno selected class i.e. the complete styling
  const finalCssValues = useCssValues(baseClasses, cssAttributesMap)
  const finalBreakpointCssValues = useCssValues(breakpointClasses, cssAttributesMap)

  // The css values for the selected class
  const selectedCssValues = useJsCssValues(useCssValues(currentBaseClasses, cssAttributesMap), breakpoint.media ? {} : style, cssAttributesMap)
  const selectedBreakpointCssValues = useJsCssValues(useCssValues(currentBreakpointClasses, cssAttributesMap), style, cssAttributesMap)

  // The css values passed to sub sections
  const passedCssValues = useMemo(() => removeCssDefaults(selectedClassName ? selectedCssValues : finalCssValues, cssAttributesMap), [selectedClassName, finalCssValues, selectedCssValues])
  const passedBreakpointCssValues = useMemo(() => removeCssDefaults(selectedClassName ? selectedBreakpointCssValues : finalBreakpointCssValues, cssAttributesMap), [selectedClassName, selectedBreakpointCssValues, finalBreakpointCssValues])

  // THe attributes to be updated
  const attributes = useMemo(() => Object.entries(removeCssDefaults(selectedBreakpointCssValues, cssAttributesMap)).map(([name, value]) => ({ name, value })), [selectedBreakpointCssValues])
  const attributesHash = useMemo(() => attributes.map(({ name, value }) => `${name}:${value}`).join(','), [attributes])
  const previousAttributesHash = usePrevious(attributesHash)

  const handleCssUpdate = useCallback(async () => {
    if (!(classNames.length && attributes.length) || previousAttributesHash === attributesHash) return
    if (!areAttributesValid(attributes, cssAttributesMap)) return

    await updateCssClass({
      classNames: selectedClassName,
      attributesJson: JSON.stringify(attributes),
      breakpointId: breakpoint.id,
    })

    refetch(refetchKeys.cssClasses)
  }, [
    classNames,
    attributes,
    attributesHash,
    previousAttributesHash,
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

    setStyle(x => {
      const updatedStyle: CssValuesType = { ...x }

      attributes.forEach(({ name, value }) => {
        updatedStyle[convertCssAttributeNameToJs(name)] = value === cssAttributesMap[name].defaultValue && breakpoint.media && typeof selectedCssValues[name] !== 'undefined'
          ? selectedCssValues[name]
          : value
      })

      return updatedStyle
    })
  }, [selectedClassName, breakpoint, selectedCssValues, setStyle])

  const renderNoElement = useCallback(() => (
    <Div
      xflex="y1"
      fontSize="0.85rem"
      px={0.5}
    >
      {isOnAnotherComponent ? (
        <>
          <Div color="text-light">
            To style this element you must edit its parent component
          </Div>
          {!!lastComponentHierarchyItem && (
            <Button
              as={Link}
              to={`/_ecu_/component/${lastComponentHierarchyItem.fileAddress}/${lastComponentHierarchyItem.componentAddress}`}
              display="flex" // To allow ellipsis, inline-flex is the default
              maxWidth="100%" // To allow ellipsis
              mt={0.5}
            >
              <Div ellipsis>
                Edit
                {' '}
                {lastComponentHierarchyItem.componentName}
              </Div>
            </Button>
          )}
        </>
      ) : (
        <Div color="text-light">
          No element selected
        </Div>
      )}
    </Div>
  ), [isOnAnotherComponent, lastComponentHierarchyItem])

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
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionSpacing
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionSize
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionPosition
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
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
    passedCssValues,
    passedBreakpointCssValues,
    selectedClassName,
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
          onLoading={setLoading}
        />
      </Div>
      {!classNames.length ? renderNoClassNames() : renderSubSections()}
    </>
  ), [
    allClasses,
    classNames,
    handleSetClassNames,
    renderNoClassNames,
    renderSubSections,
  ])

  // Reset style state on new breakpoint or new selected className
  useEffect(() => {
    setStyle({})
  }, [breakpoint, selectedClassName, setStyle])

  useEffect(() => {
    if (!Object.keys(style).length) return

    throttledHandleCssUpdate()
  // Adding throttledHandleCssUpdate as a dep seems to cause infinite useEffect trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style])

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
      {isNoElementSelected ? renderNoElement() : renderSection()}
    </Div>
  )
}

export default memo(PanelStyles)
