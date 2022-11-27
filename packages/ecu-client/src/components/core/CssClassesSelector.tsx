import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Autocomplete, Button, Div, Tooltip } from 'honorable'
import { MdOutlineClose } from 'react-icons/md'
import { BiCollapse } from 'react-icons/bi'

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
  currentClassIndex: number
  setCurrentClassIndex: Dispatch<SetStateAction<number>>
  combine: boolean
  setCombine: Dispatch<SetStateAction<boolean>>
  setLoading: Dispatch<SetStateAction<boolean>>
  onClassesChange: (classes: string[]) => void
}

const ecuCreateOption = `__ecu_create_option__${Math.random()}`

function CssClassesSelector({ allClasses, classNames, onClassesChange, currentClassIndex, setCurrentClassIndex, combine, setCombine, setLoading }: CssClassesSelector) {
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
    if (!classNames.length) return

    setLoading(true)

    await createCssClass({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyIds[hierarchyIds.length - 1],
      componentDelta,
      classNames,
      combine,
    })

    setLoading(false)

    refetch(refetchKeys.cssClasses)
  }, [
    setLoading,
    createCssClass,
    componentAddress,
    hierarchyIds,
    componentDelta,
    combine,
    refetch,
  ])

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

  useEffect(() => {
    if (!combine) return

    handleCreateClass(classNames)
  }, [combine, classNames, handleCreateClass])

  return (
    <Div
      xflex="x1"
      width="100%"
      gap={0.25}
    >
      {classNames.length > 1 && (
        <Tooltip
          label={`${combine ? 'Unchain' : 'Chain'} classes`}
          placement="bottom"
        >
          <Button
            tiny
            borderPrimary
            secondary={!combine}
            onClick={() => setCombine(x => !x)}
            flexShrink={0}
            fontSize="0.75rem"
            mt="1px"
          >
            <BiCollapse />
          </Button>
        </Tooltip>
      )}
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
        {classNames.map((className, i) => (
          <CssClassChip
            key={className}
            onDiscard={() => handleDiscardClass(className)}
            onSelect={() => setCurrentClassIndex(i)}
            primary={combine || i === currentClassIndex}
          >
            {className}
          </CssClassChip>
        ))}
        <Autocomplete
          bare
          autoHighlight
          placeholder={`${classNames.length ? 'Add' : 'Choose'} or create class`}
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
