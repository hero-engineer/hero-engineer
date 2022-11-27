import { useCallback, useMemo, useState } from 'react'
import { Autocomplete, Div } from 'honorable'
import { MdOutlineClose } from 'react-icons/md'

import { CssClassType } from '../../types'

import extractClassNamesFromSelector from '../../utils/extractClassNamesFromSelector'

type CssClassesSelector = {
  allClasses: CssClassType[],
  classNames: string[]
  onClassesChange: (classes: string[]) => void
}

const ecuCreateOption = `__ecu_create_option__${Math.random()}`

function CssClassesSelector({ allClasses, classNames, onClassesChange }: CssClassesSelector) {
  const [value, setValue] = useState('')

  const options = useMemo(() => [...new Set(
    allClasses
    .map(c => extractClassNamesFromSelector(c.selector))
    .flat()
    .filter(className => !classNames.includes(className))
  )], [allClasses, classNames])

  const handleCreateClass = useCallback(async (className: string) => {

  }, [])

  const handleDeleteClass = useCallback(async (className: string) => {

  }, [])

  const handleSelect = useCallback((selectedValue: any) => {
    setValue('')
    onClassesChange([...new Set(selectedValue === ecuCreateOption ? !value ? classNames : [...classNames, value] : [...classNames, selectedValue])])

    if (value && selectedValue === ecuCreateOption) {
      handleCreateClass(value)
    }
  }, [onClassesChange, classNames, value, handleCreateClass])

  const handleDiscardClass = useCallback((className: string) => {
    onClassesChange(classNames.filter(c => c !== className))

    handleDeleteClass(className)
  }, [classNames, onClassesChange, handleDeleteClass])

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
        inputProps={{ bare: true }}
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
