import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Autocomplete, Div } from 'honorable'
import { MdOutlineClose } from 'react-icons/md'

import { CssClassType } from '../../types'

import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'

import extractClassNamesFromSelector from '../../utils/extractClassNamesFromSelector'
import { CreateCssClassMutation, CreateCssClassMutationDataType } from '../../queries'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import { refetchKeys } from '../../constants'

type CssClassesSelector = {
  allClasses: CssClassType[]
  classNames: string[]
  selectedClassName: string
  setSelectedClassName: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  onClassesChange: (classes: string[]) => void
}

const ecuCreateOption = `__ecu_create_option__${Math.random()}`
const anyOption = { value: ecuCreateOption, label: 'Create new class' }

function CssClassesSelector({ allClasses, classNames, onClassesChange, selectedClassName, setSelectedClassName, setLoading }: CssClassesSelector) {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta } = useEditionSearchParams()

  const [search, setSearch] = useState('')

  const [{ fetching }, createCssClass] = useMutation<CreateCssClassMutationDataType>(CreateCssClassMutation)

  const options = useMemo(() => [...new Set(
    allClasses
    .map(c => extractClassNamesFromSelector(c.selector))
    .flat()
    .filter(className => !classNames.includes(className))
  )], [allClasses, classNames])

  const refetch = useRefetch()

  const handleCreateClass = useCallback(async (classNames: string[]) => {
    if (!classNames.length) return

    setLoading(true)

    await createCssClass({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyIds[hierarchyIds.length - 1],
      componentDelta,
      classNames,
    })

    setLoading(false)

    refetch(refetchKeys.cssClasses)
  }, [
    setLoading,
    createCssClass,
    componentAddress,
    hierarchyIds,
    componentDelta,
    refetch,
  ])

  const handleSelect = useCallback((selectedValue: any) => {
    const addedClassName = selectedValue === ecuCreateOption ? search : selectedValue

    setSearch('')

    if (addedClassName) {
      const nextClassNames = [...new Set(addedClassName ? [...classNames, addedClassName] : classNames)]

      onClassesChange(nextClassNames)
      handleCreateClass(nextClassNames)
      setSelectedClassName(addedClassName)
    }
  }, [onClassesChange, classNames, search, setSelectedClassName, handleCreateClass])

  const handleDiscardClass = useCallback((className: string) => {
    const nextClassNames = classNames.filter(c => c !== className)

    onClassesChange(nextClassNames)
    setSelectedClassName(x => nextClassNames.includes(x) ? x : '')
  }, [classNames, onClassesChange, setSelectedClassName])

  const handleChipSelect = useCallback((className: string) => {
    setSelectedClassName(x => x === className ? '' : className)
  }, [setSelectedClassName])

  return (
    <Div
      xflex="x41"
      flexGrow
      position="relative"
      fontSize="0.85rem"
      backgroundColor="white"
      border="1px solid border"
      borderRadius="medium"
      gap={0.25}
      p={0.25}
    >
      {classNames.map(className => (
        <CssClassChip
          key={className}
          onDiscard={() => handleDiscardClass(className)}
          onSelect={() => handleChipSelect(className)}
          primary={selectedClassName === className}
        >
          {className}
        </CssClassChip>
      ))}
      <Autocomplete
        bare
        placeholder={`${classNames.length ? 'Add' : 'Choose'} or create class`}
        options={options}
        anyOption={anyOption}
        value={search}
        onChange={x => setSearch(x === anyOption.label ? '' : x)}
        onSelect={handleSelect}
        inputProps={{ bare: true, disabled: fetching }}
        flexGrow
        flexShrink={1}
        position="initial" // Give the menu to the parent
        p={0.25}
      />
    </Div>
  )
}

type CssClassChipPropsType = {
  children: string
  onDiscard: () => void
  onSelect: () => void
  primary: boolean
}

function CssClassChip({ children, onDiscard, onSelect, primary }: CssClassChipPropsType) {
  return (
    <Div
      xflex="x4"
      flexShrink={0}
      backgroundColor={primary ? 'primary' : 'darken(background-light, 10)'}
      color={primary ? 'white' : 'text'}
      borderRadius="medium"
      p={0.25}
      minWidth={0}
      maxWidth="100%"
      cursor="pointer"
      userSelect="none"
    >
      <Div
        ellipsis
        onClick={onSelect}
        pr={0.25}
      >
        {children}
      </Div>
      <Div
        xflex="x5"
        fontSize="0.75em"
        onClick={onDiscard}
      >
        <MdOutlineClose />
      </Div>
    </Div>
  )
}

export default CssClassesSelector
