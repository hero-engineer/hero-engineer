import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Autocomplete, Div } from 'honorable'
import { MdOutlineClose } from 'react-icons/md'

type CssClassesSelector = {
  classes: string[]
  setClasses: Dispatch<SetStateAction<string[]>>
}

const allClasses = [
  'hero',
  'hero-body',
  'container',
  'columns',
  'rows',
]

const ecuCreateOption = `__ecu_create_option__${Math.random()}`

function CssClassesSelector({ classes, setClasses }: CssClassesSelector) {
  const [value, setValue] = useState('')

  const options = useMemo(() => allClasses.filter(c => !classes.includes(c)), [classes])

  const handleSelect = useCallback((selectedValue: any) => {
    setClasses(x => [...new Set(selectedValue === ecuCreateOption ? !value ? x : [...x, value] : [...x, selectedValue])])
    setValue('')
  }, [setClasses, value])

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
          onDiscard={() => setClasses(classes => classes.filter(c => c !== className))}
        >
          {className}
        </CssClassChip>
      ))}
      <Autocomplete
        bare
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
        py={0.25}
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
