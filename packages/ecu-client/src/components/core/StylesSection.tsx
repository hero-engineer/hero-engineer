import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Div, useDebounce } from 'honorable'

import { CssAttributeType, CssValueType } from '../../types'
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
import usePersistedState from '../../hooks/usePersistedState'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'

import getComponentRootHierarchyIds from '../../helpers/getComponentRootHierarchyIds'

import filterClassesByClassNames from '../../utils/filterClassesByClassNames'
import convertCssAttributeNameToJs from '../../utils/convertCssAttributeNameToJs'
import removeCssDefaults from '../../utils/removeCssDefaults'
import filterInvalidCssValues from '../../utils/filterInvalidCssValues'
import convertUnicode from '../../utils/convertUnicode'

import CssClassesSelector from './CssClassesSelector'
import StylesSubSectionLayout from './StylesSubSectionLayout'
import StylesSubSectionSpacing from './StylesSubSectionSpacing'

// The styles section
// Displayed in the right panel
function StylesSection() {
  const { componentAddress = '' } = useParams()
  const { hierarchy } = useContext(HierarchyContext)
  const { componentDelta, hierarchyIds } = useEditionSearchParams()
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

  const componentRootHierarchyIds = useMemo(() => getComponentRootHierarchyIds(hierarchy), [hierarchy])
  const isSomeNodeSelected = useMemo(() => hierarchy.length > 0, [hierarchy])
  const isComponentRoot = useMemo(() => componentDelta < 0 && componentRootHierarchyIds.some(x => x === hierarchyIds[hierarchyIds.length - 1]), [componentDelta, componentRootHierarchyIds, hierarchyIds])
  const isOnAnotherComponent = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].onComponentAddress !== componentAddress, [hierarchy, componentAddress])
  const isNoElementSelected = useMemo(() => !hierarchy.length || hierarchy[hierarchy.length - 1].isRoot || isComponentRoot || isOnAnotherComponent, [hierarchy, isComponentRoot, isOnAnotherComponent])
  const debouncedIsNoElementSelected = useDebounce(isNoElementSelected, 6 * 16) // To prevent flickering of the section
  const debouncedIsOnAnotherComponent = useDebounce(isSomeNodeSelected && isOnAnotherComponent, 6 * 16) // To prevent flickering of the section

  const allClasses = useMemo(() => cssClassesQueryResult.data?.cssClasses || [], [cssClassesQueryResult.data])
  const classes = useMemo(() => filterClassesByClassNames(allClasses, classNames), [allClasses, classNames])
  const currentClass = useMemo(() => filterClassesByClassNames(classes, [selectedClassName]), [classes, selectedClassName])
  const finalCssValues = useJsCssValues(useCssValues(classes, cssAttributesMap), updatedStyles, cssAttributesMap)
  const workingCssValues = useJsCssValues(useCssValues(currentClass, cssAttributesMap), updatedStyles, cssAttributesMap)

  const handleCssUpdate = useCallback(async () => {
    if (!classNames.length) return

    const attributes = Object.entries(filterInvalidCssValues(removeCssDefaults(workingCssValues, cssAttributesMap), cssAttributesMap)).map(([name, value]) => ({ name, value }))

    await updateCssClass({
      classNames: convertUnicode(selectedClassName),
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
    setClassName(classes.join(' ') || ' ') // HACK to force useEditionProps to use an empty updated className
    setUpdatedStyles({})
  }, [setClassName, setUpdatedStyles])

  const handleStyleChange = useCallback((attributes: CssAttributeType[]) => {
    if (!selectedClassName) return

    const updatedStyles: Record<string, CssValueType> = {}

    attributes.forEach(({ name, value }) => {
      updatedStyles[convertCssAttributeNameToJs(name)] = value
    })

    setUpdatedStyles(x => ({ ...x, ...updatedStyles }))
  }, [selectedClassName, setUpdatedStyles])

  const renderNoElement = useCallback(() => (
    <Div
      color="text-light"
      fontSize="0.85rem"
      px={0.5}
    >
      {debouncedIsOnAnotherComponent ? 'To edit this element you must edit its parent component' : 'No element selected'}
    </Div>
  ), [debouncedIsOnAnotherComponent])

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
        cssValues={selectedClassName ? workingCssValues : finalCssValues}
        onChange={handleStyleChange}
        disabled={!selectedClassName}
      />
      <StylesSubSectionSpacing
        cssValues={selectedClassName ? workingCssValues : finalCssValues}
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
      {debouncedIsNoElementSelected ? renderNoElement() : renderSection()}
    </Div>
  )
}

export default memo(StylesSection)
