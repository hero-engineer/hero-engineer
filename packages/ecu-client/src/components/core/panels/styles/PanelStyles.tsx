import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Div } from 'honorable'

import CssClassesSelector from './CssClassesSelector'
import StylesSubSectionTypography from './StylesSubSectionTypography'
import StylesSubSectionSpacing from './StylesSubSectionSpacing'
import StylesSubSectionLayout from './StylesSubSectionLayout'
import StylesSubSectionSize from './StylesSubSectionSize'
import StylesSubSectionPosition from './StylesSubSectionPosition'

import { CssAttributeType, CssValuesType } from '@types'

import { refetchKeys } from '@constants'

import { CssClassesQuery, CssClassesQueryDataType, UpdateCssClassMutation, UpdateCssClassMutationDataType } from '@queries'

import HierarchyContext from '@contexts/HierarchyContext'
import CssClassesContext from '@contexts/CssClassesContext'
import BreakpointContext from '@contexts/BreakpointContext'
import EditionContext from '@contexts/EditionContext'

import useQuery from '@hooks/useQuery'
import useMutation from '@hooks/useMutation'
import useRefetch from '@hooks/useRefetch'
import useCssValues from '@hooks/useCssValues'
import useJsCssValues from '@hooks/useJsCssValues'
import usePrevious from '@hooks/usePrevious'
import useThrottleAsynchronous from '@hooks/useThrottleAsynchronous'

import getComponentRootHierarchyIds from '@utils/getComponentRootHierarchyIds'
import getLastComponentHierarchyItem from '@utils/getLastComponentHierarchyItem'
import convertCssAttributeNameToJs from '@utils/convertCssAttributeNameToJs'
import filterClassesByClassNamesAndMedias from '@utils/filterClassesByClassNamesAndMedias'
import areAttributesValid from '@utils/areAttributesValid'

// The styles section
// Displayed in the right panel
function PanelStyles() {
  const { componentAddress = '' } = useParams()
  const { hierarchy } = useContext(HierarchyContext)
  const { componentDelta, hierarchyId } = useContext(EditionContext)
  const { className, setClassName, selectedClassName, style, setStyle } = useContext(CssClassesContext)
  const { breakpoint, breakpoints } = useContext(BreakpointContext)

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })
  const [, updateCssClass] = useMutation<UpdateCssClassMutationDataType>(UpdateCssClassMutation)

  const refetch = useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  const classNames = useMemo(() => className.split(' ').map(c => c.trim()).filter(Boolean), [className])

  const [isStyleUpdated, setIsStyleUpdated] = useState(false)
  const [loading, setLoading] = useState(false)

  const lastComponentHierarchyItem = useMemo(() => getLastComponentHierarchyItem(hierarchy), [hierarchy])
  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyId), [componentDelta, componentRootHierarchyIds, hierarchyId])
  const isOnAnotherComponent = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].onComponentAddress !== componentAddress, [hierarchy, componentAddress])
  const isNoElementSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot || isComponentRoot || isOnAnotherComponent, [hierarchy, isComponentRoot, isOnAnotherComponent])

  // The medias that can impact the current breakpoint
  const concernedMedias = useMemo(() => {
    const indexOfMasterBreakpoint = breakpoints.findIndex(b => !b.media)
    const indexOfCurrentBreakpoint = breakpoints.findIndex(b => b.id === breakpoint.id)
    // Determines weither the current breakpoint is going upscreen or downscreen from the master breakpoint
    const isGoingUpscreen = indexOfMasterBreakpoint > indexOfCurrentBreakpoint
    const concernedMedias: string[] = []

    let i = indexOfMasterBreakpoint

    while (true) {
      concernedMedias.push(breakpoints[i].media)

      if (i === indexOfCurrentBreakpoint) break

      i += isGoingUpscreen ? -1 : 1

      if (!breakpoints[i]) break
    }

    return concernedMedias
  }, [breakpoints, breakpoint])

  // Arrays of CssClasses
  // All classes
  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses ?? [], [cssClassesQueryResult.data])
  // Master breakpoint classes for the full className
  const masterBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, classNames, ['']), [allClasses, classNames])
  // Master breakpoint classes for the selected className
  const selectedMasterBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(masterBreakpointClasses, [selectedClassName], ['']), [masterBreakpointClasses, selectedClassName])
  // Current breakpoint classes for the full className
  const currentBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, classNames, concernedMedias), [allClasses, classNames, concernedMedias])
  // Current breakpoint classes for the selected className
  const selectedCurrentBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, [selectedClassName], concernedMedias), [allClasses, selectedClassName, concernedMedias])

  // The css values for the complete styling
  // Displayed when no class is selected
  const fullCssValues = useCssValues(masterBreakpointClasses)
  const fullBreakpointCssValues = useCssValues(currentBreakpointClasses)

  // The css values for the selected class
  // Displayed when a class is selected
  const selectedCssValues = useJsCssValues(useCssValues(selectedMasterBreakpointClasses), breakpoint.media ? {} : style)
  const selectedBreakpointCssValues = useJsCssValues(useCssValues(selectedCurrentBreakpointClasses), style)

  // The css values passed to sub sections
  const passedCssValues = selectedClassName ? selectedCssValues : fullCssValues
  const passedBreakpointCssValues = selectedClassName ? selectedBreakpointCssValues : fullBreakpointCssValues

  // The attributes to be updated
  const attributes = useMemo(() => Object.entries(selectedBreakpointCssValues).map(([name, value]) => ({ name, value })), [selectedBreakpointCssValues])
  const attributesHash = useMemo(() => attributes.map(({ name, value }) => `${name}:${value}`).join('_'), [attributes])
  const previousAttributesHash = usePrevious(attributesHash)

  console.log('concernedMedias', concernedMedias)
  console.log('v, bv', passedCssValues, passedBreakpointCssValues)

  const handleCssUpdate = useCallback(async () => {
    if (!classNames.length || previousAttributesHash === attributesHash) return
    if (!areAttributesValid(attributes)) return
    if (!isStyleUpdated) return

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
    isStyleUpdated,
    updateCssClass,
    refetch,
  ])

  const throttledHandleCssUpdate = useThrottleAsynchronous(handleCssUpdate, 500)

  const handleSetClassNames = useCallback((classes: string[]) => {
    setClassName(classes.join(' ') || ' ') // HACK to force useEditionProps to use an empty updated className
    setStyle({})
    setIsStyleUpdated(false)
  }, [setClassName, setStyle])

  const handleStyleChange = useCallback((attributes: CssAttributeType[]) => {
    if (!selectedClassName) return

    setStyle(x => {
      const updatedStyle: CssValuesType = { ...x }

      attributes.forEach(({ name, value }) => {
        updatedStyle[convertCssAttributeNameToJs(name)] = value
      })

      return updatedStyle
    })
    setIsStyleUpdated(true)
  }, [selectedClassName, setStyle])

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
      <StylesSubSectionTypography
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
    setIsStyleUpdated(false)
  }, [breakpoint, selectedClassName, setStyle])

  useEffect(() => {
    throttledHandleCssUpdate()
  // Adding throttledHandleCssUpdate as a dep seems to cause infinite useEffect trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributesHash])

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
