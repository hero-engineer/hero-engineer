import { useCallback, useMemo, useState } from 'react'
import { Autocomplete, Div } from 'honorable'
import { MdOutlineClose } from 'react-icons/md'

import { CssClassType } from '../../types'

import extractSelectors from '../../utils/extractSelectors'

type CssClassesSelector = {
  allClasses: CssClassType[],
  classes: string[]
  onClassesChange: (classes: string[]) => void
}

const ecuCreateOption = `__ecu_create_option__${Math.random()}`

function CssClassesSelector({ allClasses, classes, onClassesChange }: CssClassesSelector) {
  const [value, setValue] = useState('')

  const options = useMemo(() => [...new Set(
    allClasses
    .map(c => extractSelectors(c.selector))
    .flat()
    .filter(className => !classes.includes(className))
  )], [allClasses, classes])

  const handleSelect = useCallback((selectedValue: any) => {
    setValue('')
    onClassesChange([...new Set(selectedValue === ecuCreateOption ? !value ? classes : [...classes, value] : [...classes, selectedValue])])
  }, [onClassesChange, classes, value])

  const handleDiscardClass = useCallback((className: string) => {
    onClassesChange(classes.filter(c => c !== className))
  }, [classes, onClassesChange])

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
      {classes.map(className => (
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
        placeholder={`${classes.length ? 'Combine' : 'Choose'} or create class`}
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
