import { CSSProperties, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Div } from 'honorable'

import { CssAttributeType, CssValuesType, HierarchyType } from '~types'

import { refetchKeys } from '~constants'

import { CssClassesQuery, CssClassesQueryDataType, UpdateCssClassMutation, UpdateCssClassMutationDataType } from '~queries'

import createSelector from '~processors/css/createSelector'

import HierarchyContext from '~contexts/HierarchyContext2'
import BreakpointContext from '~contexts/BreakpointContext'

import useQuery from '~hooks/useQuery'
import useMutation from '~hooks/useMutation'
import useRefetch from '~hooks/useRefetch'
import usePrevious from '~hooks/usePrevious'
import useCssValues from '~hooks/useCssValues'
import useJsCssValues from '~hooks/useJsCssValues'
import usePersistedState from '~hooks/usePersistedState'
import useThrottleAsynchronous from '~hooks/useThrottleAsynchronous'

import convertCssAttributeNameToJs from '~utils/convertCssAttributeNameToJs'
import filterClassesByClassNamesAndMedias from '~utils/filterClassesByClassNamesAndMedias'
import areAttributesValid from '~utils/areAttributesValid'

import StylesSubSectionPosition from './StylesSubSectionPosition'
import StylesSubSectionSize from './StylesSubSectionSize'
import StylesSubSectionLayout from './StylesSubSectionLayout'
import StylesSubSectionSpacing from './StylesSubSectionSpacing'
import StylesSubSectionTypography from './StylesSubSectionTypography'
import CssClassesSelector from './CssClassesSelector'

// TODO move to utils and dedupe from HierarchyOverlay
function findHierarchy(hierarchy: HierarchyType | null, targetId: string): HierarchyType | null {
  if (!hierarchy) return null
  if (hierarchy.id === targetId) return hierarchy

  return hierarchy.children.map(h => findHierarchy(h, targetId)).find(x => x) ?? null
}

// The styles panel
// Displayed in the right retractable panel
function PanelStyles() {
  const { breakpoint, breakpoints } = useContext(BreakpointContext)
  const { hierarchy, currentHierarchyId } = useContext(HierarchyContext)

  const [cssClassesQueryResult, refetchCssClassesQuery] = useQuery<CssClassesQueryDataType>({
    query: CssClassesQuery,
  })
  // const [, updateCssClass] = useMutation<UpdateCssClassMutationDataType>(UpdateCssClassMutation)

  const refetch = useRefetch({
    key: refetchKeys.cssClasses,
    refetch: refetchCssClassesQuery,
  })

  const currentHierarchy = useMemo(() => findHierarchy(hierarchy, currentHierarchyId), [hierarchy, currentHierarchyId])
  const className = useMemo(() => currentHierarchy && currentHierarchy.element ? currentHierarchy.element.className : '', [currentHierarchy])
  const classNames = useMemo(() => className.split(' ').map(c => c.trim()).filter(Boolean), [className])
  const isNoElementSelected = useMemo(() => currentHierarchy?.type !== 'element', [currentHierarchy])

  const [selectedClassName, setSelelectedClassName] = usePersistedState('selected-class-name', '')
  const [style, setStyle] = useState<CSSProperties>({})

  const [isStyleUpdated, setIsStyleUpdated] = useState(false)
  const [loading, setLoading] = useState(false)

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
  // Current breakpoints classes for the full className
  const breakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, classNames, concernedMedias), [allClasses, classNames, concernedMedias])
  // Current breakpoints classes for the selected className
  const selectedBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, [selectedClassName], concernedMedias), [allClasses, selectedClassName, concernedMedias])
  // Current breakpoint classes for the full className
  const currentBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, classNames, [breakpoint.media]), [allClasses, classNames, breakpoint.media])
  // Current breakpoint classes for the selected className
  const selectedCurrentBreakpointClasses = useMemo(() => filterClassesByClassNamesAndMedias(allClasses, [selectedClassName], [breakpoint.media]), [allClasses, selectedClassName, breakpoint.media])

  // The css values for the complete styling
  // Displayed when no class is selected
  const fullCssValues = useCssValues(masterBreakpointClasses)
  const fullBreakpointCssValues = useCssValues(breakpointClasses)
  const fullCurrentBreakpointCssValues = useCssValues(currentBreakpointClasses) // Might be unused

  // The css values for the selected class
  // Displayed when a class is selected
  const selectedCssValues = useJsCssValues(useCssValues(selectedMasterBreakpointClasses), breakpoint.media ? {} : style)
  const selectedBreakpointCssValues = useJsCssValues(useCssValues(selectedBreakpointClasses), style)
  const selectedCurrentBreakpointCssValues = useJsCssValues(useCssValues(selectedCurrentBreakpointClasses), style)

  // The css values passed to sub sections
  const passedCssValues = selectedClassName ? selectedCssValues : fullCssValues
  const passedBreakpointCssValues = selectedClassName ? selectedBreakpointCssValues : fullBreakpointCssValues
  const passedCurrentBreakpointCssValues = selectedClassName ? selectedCurrentBreakpointCssValues : fullCurrentBreakpointCssValues

  // The attributes to be updated
  const attributes = useMemo(() => Object.entries(selectedBreakpointCssValues).map(([name, value]) => ({ name, value })), [selectedBreakpointCssValues])
  const attributesHash = useMemo(() => attributes.map(({ name, value }) => `${name}:${value}`).join('_'), [attributes])
  const previousAttributesHash = usePrevious(attributesHash)

  // console.log('concernedMedias', concernedMedias)
  // console.log('style', style)
  // console.log('v, bv, cv', passedCssValues, passedBreakpointCssValues, passedCurrentBreakpointCssValues)

  const handleCssUpdate = useCallback(async () => {
    if (!classNames.length || previousAttributesHash === attributesHash) return
    if (!areAttributesValid(attributes)) return
    if (!isStyleUpdated) return

    // await updateCssClass({
    //   classNames: selectedClassName,
    //   attributesJson: JSON.stringify(attributes),
    //   breakpointId: breakpoint.id,
    // })

    refetch(refetchKeys.cssClasses)
  }, [
    classNames,
    attributes,
    attributesHash,
    previousAttributesHash,
    // selectedClassName,
    // breakpoint,
    isStyleUpdated,
    // updateCssClass,
    refetch,
  ])

  const throttledHandleCssUpdate = useThrottleAsynchronous(handleCssUpdate, 500)

  const handleCreateClassName = useCallback((className: string) => {
    const code = createSelector(`.${className}`, breakpoints)

    console.log('code', code)
  }, [breakpoints])

  const updateClassName = useCallback((className: string) => {
    if (!(currentHierarchy && currentHierarchy.element)) return

    currentHierarchy.element.className = className

    // TODO update the file
  }, [currentHierarchy])

  const handleSetClassNames = useCallback((classes: string[]) => {
    updateClassName(classes.join(' '))
    setStyle({})
    setIsStyleUpdated(false)
  }, [updateClassName, setStyle])

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
      <Div color="text-light">
        No element selected
      </Div>
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
        currentBreakpointCssValues={passedCurrentBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionSpacing
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        currentBreakpointCssValues={passedCurrentBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionSize
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        currentBreakpointCssValues={passedCurrentBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionPosition
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        currentBreakpointCssValues={passedCurrentBreakpointCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionTypography
        cssValues={passedCssValues}
        breakpointCssValues={passedBreakpointCssValues}
        currentBreakpointCssValues={passedCurrentBreakpointCssValues}
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
    passedCurrentBreakpointCssValues,
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
          onCreateClassName={handleCreateClassName}
          onClassNamesChange={handleSetClassNames}
          selectedClassName={selectedClassName}
          onSelectedClassNameChange={setSelelectedClassName}
        />
      </Div>
      {!classNames.length ? renderNoClassNames() : renderSubSections()}
    </>
  ), [
    allClasses,
    classNames,
    selectedClassName,
    handleCreateClassName,
    handleSetClassNames,
    setSelelectedClassName,
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
