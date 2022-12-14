import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Autocomplete, Div, WithOutsideClick } from 'honorable'
import createEmojiRegex from 'emoji-regex'
import { MdOutlineClose } from 'react-icons/md'
import { HiOutlineFaceSmile } from 'react-icons/hi2'

import { CssClassType } from '~types'

import { zIndexes } from '~constants'

import extractClassNamesFromSelector from '~utils/extractClassNamesFromSelector'

import EmojiPickerBase from '~core/emoji/EmojiPickerBase'

type CssClassesSelector = {
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

function CssClassesSelector({ allClasses, classNames, selectedClassName, onSelectedClassNameChange, onCreateClassName, onClassNamesChange }: CssClassesSelector) {
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
      const nextClassNames = [...new Set(addedClassName ? [...classNames, addedClassName] : classNames)]

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
            <CssClassChip
              key={className}
              onDiscard={() => handleDiscardClass(className)}
              onSelect={() => handleChipSelect(className)}
              primary={selectedClassName === className}
            >
              {className}
            </CssClassChip>
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
      backgroundColor={primary ? 'primary' : 'background-light-light'}
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
