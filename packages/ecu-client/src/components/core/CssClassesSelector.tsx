import { useCallback, useMemo, useState } from 'react'
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
  allClasses: CssClassType[],
  classNames: string[]
  onClassesChange: (classes: string[]) => void
}

const ecuCreateOption = `__ecu_create_option__${Math.random()}`

function CssClassesSelector({ allClasses, classNames, onClassesChange }: CssClassesSelector) {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta } = useEditionSearchParams()

  const [value, setValue] = useState('')

  const [{ fetching }, createCssClass] = useMutation<CreateCssClassMutationDataType>(CreateCssClassMutation)

  const options = useMemo(() => [...new Set(
    allClasses
    .map(c => extractClassNamesFromSelector(c.selector))
    .flat()
    .filter(className => !classNames.includes(className))
  )], [allClasses, classNames])

  const refetch = useRefetch()

  const handleCreateClass = useCallback(async (classNames: string[]) => {
    await createCssClass({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyIds[hierarchyIds.length - 1],
      componentDelta,
      classNames,
    })

    refetch(refetchKeys.cssClasses)
  }, [createCssClass, componentAddress, hierarchyIds, componentDelta, refetch])

  const handleSelect = useCallback((selectedValue: any) => {
    setValue('')

    const nextClassNames = [...new Set(selectedValue === ecuCreateOption ? !value ? classNames : [...classNames, value] : [...classNames, selectedValue])]

    onClassesChange(nextClassNames)
    handleCreateClass(nextClassNames)
  }, [onClassesChange, classNames, value, handleCreateClass])

  const handleDiscardClass = useCallback((className: string) => {
    const nextClassNames = classNames.filter(c => c !== className)

    onClassesChange(nextClassNames)
    handleCreateClass(nextClassNames)
  }, [classNames, onClassesChange, handleCreateClass])

  return (
    <Div
      xflex="x41"
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
        >
          {className}
        </CssClassChip>
      ))}
      <Autocomplete
        bare
        autoHighlight
        placeholder={`${classNames.length ? 'Combine' : 'Choose'} or create class`}
        options={options}
        anyOption={{ value: ecuCreateOption, label: 'Create new class' }}
        value={value}
        onChange={setValue}
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
}

function CssClassChip({ children, onDiscard }: CssClassChipPropsType) {
  return (
    <Div
      xflex="x4"
      flexShrink={0}
      backgroundColor="primary"
      color="white"
      borderRadius="medium"
      gap={0.25}
      p={0.25}
      minWidth={0}
      maxWidth="100%"
    >
      <Div ellipsis>
        {children}
      </Div>
      <Div
        xflex="x5"
        fontSize="0.75em"
        cursor="pointer"
        onClick={onDiscard}
      >
        <MdOutlineClose />
      </Div>
    </Div>
  )
}

export default CssClassesSelector
