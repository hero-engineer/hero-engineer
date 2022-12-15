import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Autocomplete, Div, WithOutsideClick } from 'honorable'
import createEmojiRegex from 'emoji-regex'
import { HiOutlineFaceSmile } from 'react-icons/hi2'

import { CssClassType } from '~types'

import { zIndexes } from '~constants'

import extractClassNamesFromSelector from '~utils/extractClassNamesFromSelector'

import EmojiPickerBase from '~core/emoji/EmojiPickerBase'
import CssSelectorChip from '~core/full-ast/panels/styles/CssSelectorChip'

type CssSelectorPropType = {
  allClasses: CssClassType[]
  classNames: string[]
  selectedClassName: string
  onCreateClassName: (className: string) => void
  onClassNamesChange: (classNames: string[]) => void
  onSelectedClassNameChange: Dispatch<SetStateAction<string>>
}

const emojiRegex = createEmojiRegex()
const classNameRegex = /^[a-zA-Z_-]+[\w-]*$/
const classNameRegex2 = /^[a-zA-Z_-]*[\w-]*$/

const ecuAnyValue = `__ecu_any__${Math.random()}`
const anyOption = { value: ecuAnyValue, label: 'Create new class' }
const ecuErrorValue = `__ecu_error__${Math.random()}`
const errorOption = { value: ecuErrorValue, label: 'Invalid class name' }

function CssSelector({ allClasses, classNames, selectedClassName, onSelectedClassNameChange, onCreateClassName, onClassNamesChange }: CssSelectorPropType) {
  const [search, setSearch] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)

  // const [{ fetching }, createCssClass] = useMutation<CreateCssClassMutationDataType>(CreateCssClassMutation)

  const isError = useMemo(() => {
    if (!search) return false

    const match = search.match(emojiRegex)
    const replaced = search.replaceAll(emojiRegex, '')

    return !!replaced && !(match && match.index === 0 ? classNameRegex2.test(replaced) : classNameRegex.test(replaced))
  }, [search])

  const options = useMemo(() => isError ? [] : [...new Set(
    allClasses
    .map(c => extractClassNamesFromSelector(c.selector))
    .flat()
    .filter(className => !classNames.includes(className))
  )], [isError, allClasses, classNames])

  const handleSearch = useCallback((nextSearch: string) => {
    setSearch(nextSearch === anyOption.label || nextSearch === errorOption.label ? '' : nextSearch)
  }, [])

  const handleSelect = useCallback((selectedValue: any) => {
    if (selectedValue === ecuErrorValue || isError) return

    const addedClassName = selectedValue === ecuAnyValue ? search : selectedValue

    setSearch('')

    if (addedClassName) {
      const nextClassNames = [...new Set([...classNames, addedClassName])]

      if (nextClassNames.length === classNames.length) return

      onCreateClassName(addedClassName)
      onClassNamesChange(nextClassNames)
      onSelectedClassNameChange(addedClassName)
    }
  }, [
    isError,
    search,
    classNames,
    onCreateClassName,
    onClassNamesChange,
    onSelectedClassNameChange,
  ])

  const handleDiscardClass = useCallback((className: string) => {
    const nextClassNames = classNames.filter(c => c !== className)

    onClassNamesChange(nextClassNames)
    onSelectedClassNameChange(x => nextClassNames.includes(x) ? x : '')
  }, [classNames, onClassNamesChange, onSelectedClassNameChange])

  const handleChipSelect = useCallback((className: string) => {
    onSelectedClassNameChange(x => x === className ? '' : className)
  }, [onSelectedClassNameChange])

  const handleChipDrop = useCallback((dragSelector: string, dropSelector: string, isLeftDropZone: boolean) => {
    const nextClassNames = [...classNames]

    nextClassNames.splice(nextClassNames.indexOf(dragSelector), 1)
    nextClassNames.splice(nextClassNames.indexOf(dropSelector) + (isLeftDropZone ? 0 : 1), 0, dragSelector)

    if (nextClassNames.join(' ') === classNames.join(' ')) return

    onClassNamesChange(nextClassNames)
  }, [classNames, onClassNamesChange])

  const handleEmojiSelect = useCallback((_unified: string, emoji: string) => {
    setSearch(x => x + emoji)
    setIsEmojiPickerOpen(false)
    setForceOpen(true)
  }, [])

  const handleEmojiOutsideClick = useCallback((event: MouseEvent | TouchEvent) => {
    event.stopPropagation()

    setIsEmojiPickerOpen(false)
  }, [])

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
              onDiscard={() => handleDiscardClass(className)}
              onSelect={() => handleChipSelect(className)}
              onDrop={handleChipDrop}
              isSelected={selectedClassName === className}
            />
          ))}
        </Div>
      )}
      <Autocomplete
        bare
        placeholder={`${classNames.length ? 'Add' : 'Choose'} or create class`}
        options={options}
        anyOption={isError ? errorOption : anyOption}
        value={search}
        onChange={handleSearch}
        onSelect={handleSelect}
        onOpen={setIsMenuOpen}
        forceOpen={forceOpen}
        onForceOpen={() => setForceOpen(false)}
        inputProps={{
          bare: true,
          color: isError ? 'danger' : 'inherit',
          onClick: () => setForceOpen(true),
        }}
        endIcon={(
          isMenuOpen
            ? (
              <HiOutlineFaceSmile
                onClick={() => setIsEmojiPickerOpen(x => !x)}
                style={{ cursor: 'pointer' }}
              />
            )
            : null
        )}
        flexGrow
        flexShrink={1}
        position="initial" // Give the menu to the parent
        p={0.25}
      />
      {isEmojiPickerOpen && (
        <>
          <Div
            // Overlay to prevent outside click to select anything
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={zIndexes.cssClassesSelectorEmojiPicker}
          />
          <WithOutsideClick
            preventFirstFire
            onOutsideClick={handleEmojiOutsideClick}
          >
            <Div
              position="fixed"
              top={8}
              right={8}
              zIndex={zIndexes.cssClassesSelectorEmojiPicker + 1}
            >
              <EmojiPickerBase onChange={handleEmojiSelect} />
            </Div>
          </WithOutsideClick>
        </>
      )}
      {false && (
        <Div
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
        />
      )}
    </Div>
  )
}

export default CssSelector
