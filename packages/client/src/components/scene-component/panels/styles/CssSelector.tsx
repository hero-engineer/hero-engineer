import { Dispatch, SetStateAction, memo, useCallback, useMemo, useState } from 'react'
import { Autocomplete, Div } from 'honorable'

import CssSelectorChip from '~components/scene-component/panels/styles/CssSelectorChip'

type CssSelectorPropType = {
  allClasseNames: string[]
  classNames: string[]
  selectedClassName: string
  onCreateClassName: (className: string) => void
  onDeleteClassName: (className: string) => void
  onClassNamesChange: (classNames: string[]) => void
  onSelectedClassNameChange: Dispatch<SetStateAction<string>>
  onWarnAboutCssClassOrdering: () => void
}

const classNameRegex = /^[a-zA-Z_-]+[\w-]*$/

const anyValue = `__hero_any__${Math.random()}`
const anyOption = { value: anyValue, label: 'Create new class' }
const errorValue = `__hero_error__${Math.random()}`
const errorOption = { value: errorValue, label: 'Invalid class name' }

function CssSelector({
  allClasseNames,
  classNames,
  selectedClassName,
  onSelectedClassNameChange,
  onCreateClassName,
  onDeleteClassName,
  onClassNamesChange,
  onWarnAboutCssClassOrdering,
}: CssSelectorPropType) {
  const [search, setSearch] = useState('')
  const [forceOpen, setForceOpen] = useState(false)

  const isError = useMemo(() => !!search && !classNameRegex.test(search), [search])
  const options = useMemo(() => isError ? [] : [...new Set(allClasseNames.filter(className => !classNames.includes(className)))], [isError, allClasseNames, classNames])

  const handleSearch = useCallback((nextSearch: string) => {
    setSearch(nextSearch === anyOption.label || nextSearch === errorOption.label ? '' : nextSearch)
  }, [])

  const handleSelect = useCallback((selectedValue: any) => {
    setSearch('')

    if (selectedValue === errorValue || isError) return

    const isCreated = selectedValue === anyValue
    const addedClassName = isCreated ? search : selectedValue

    if (!addedClassName) return

    const nextClassNames = [...new Set([...classNames, addedClassName])]

    if (nextClassNames.length === classNames.length) return

    if (isCreated) onCreateClassName(addedClassName)

    const orderedNextClassNames = [...nextClassNames]

    if (!isCreated) {
      orderedNextClassNames.sort((a, b) => allClasseNames.indexOf(a) < allClasseNames.indexOf(b) ? -1 : 1)

      if (nextClassNames.join(' ') !== orderedNextClassNames.join(' ')) onWarnAboutCssClassOrdering()
    }

    onClassNamesChange(orderedNextClassNames)
    onSelectedClassNameChange(addedClassName)
  }, [
    isError,
    search,
    allClasseNames,
    classNames,
    onCreateClassName,
    onClassNamesChange,
    onSelectedClassNameChange,
    onWarnAboutCssClassOrdering,
  ])

  const handleChipSelect = useCallback((className: string) => {
    onSelectedClassNameChange(x => x === className ? '' : className)
  }, [onSelectedClassNameChange])

  const handleChipDiscard = useCallback((className: string) => {
    const nextClassNames = classNames.filter(c => c !== className)

    onClassNamesChange(nextClassNames)
    onSelectedClassNameChange(x => nextClassNames.includes(x) ? x : '')
  }, [classNames, onClassNamesChange, onSelectedClassNameChange])

  const handleChipDelete = useCallback((className: string) => {
    handleChipDiscard(className)
    onDeleteClassName(className)
  }, [handleChipDiscard, onDeleteClassName])

  return (
    <Div
      xflex="y2s"
      flexGrow
      position="relative"
      fontSize="0.85rem"
      backgroundColor="background"
      border="1px solid border"
      borderRadius="medium"
      gap={0.25}
      p={0.25}
    >
      {!!classNames.length && (
        <Div
          xflex="x11"
          gap={0.25}
        >
          {classNames.map(className => (
            <CssSelectorChip
              key={className}
              selector={className}
              isSelected={selectedClassName === className}
              onSelect={() => handleChipSelect(className)}
              onDiscard={() => handleChipDiscard(className)}
              onDelete={() => handleChipDelete(className)}
            />
          ))}
        </Div>
      )}
      <Autocomplete
        bare
        placeholder={`${classNames.length ? 'Add' : 'Choose'} or create a custom class`}
        options={options}
        anyOption={isError ? errorOption : anyOption}
        value={search}
        onChange={handleSearch}
        onSelect={handleSelect}
        forceOpen={forceOpen}
        onForceOpen={() => setForceOpen(false)}
        inputProps={{
          bare: true,
          color: isError ? 'danger' : 'inherit',
          onClick: () => setForceOpen(true),
        }}
        flexGrow
        flexShrink={1}
        position="static" // Give the menu to the parent
        p={0.25}
      />
    </Div>
  )
}

export default memo(CssSelector)
