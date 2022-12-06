import { HTMLProps, KeyboardEvent, Ref, forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'urql'
import { Input, WithOutsideClick } from 'honorable'

import { refetchKeys } from '@constants'

import { UpdateTextValueMutation, UpdateTextValueMutationDataType } from '@queries'

import HotContext from '@contexts/HotContext'

import useEditionProps from '@hooks/useEditionProps'
import useForkedRef from '@hooks/useForkedRef'
import useRefetch from '@hooks/useRefetch'

type TextPropsType = Omit<HTMLProps<HTMLDivElement>, 'children'> & {
  'data-ecu': string
  children: string
}

const castChildren = (x: any) => Array.isArray(x) ? x.join('') : x
const appendCarriageReturn = (x: string) => typeof x === 'string' ? `${x}\n` : x

// A text component
// TODO use a preprocessor before production build to replace Text with a regular Div
function TextRef({ 'data-ecu': ecuId, className, children }: TextPropsType, ref: Ref<any>) {
  const { componentAddress = '' } = useParams()
  const hot = useContext(HotContext)
  const [value, setValue] = useState(castChildren(children))
  const [loading, setLoading] = useState(false)
  const {
    ref: editionRef,
    hierarchyId,
    isEdited,
    setIsEdited,
    editionProps,
  } = useEditionProps<HTMLDivElement>(ecuId, className, true)

  const finalRef = useForkedRef(ref, editionRef)

  const [, updateTextValueMutation] = useMutation<UpdateTextValueMutationDataType>(UpdateTextValueMutation)

  const refetch = useRefetch()

  const handleBlur = useCallback(async () => {
    setIsEdited(false)

    if (value === children) return

    setLoading(true)

    const mutationResult = await updateTextValueMutation({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyId,
      value,
    })

    if (mutationResult.error) {
      setLoading(false)
    }
    else {
      refetch(refetchKeys.componentScreenshot)
    }
  }, [
    componentAddress,
    hierarchyId,
    value,
    children,
    updateTextValueMutation,
    setIsEdited,
    refetch,
  ])

  const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (((event.shiftKey || event.ctrlKey || event.metaKey) && event.key === 'Enter') || event.key === 'Tab') {
      event.preventDefault()
      handleBlur()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setIsEdited(false)
      setValue(children)
    }
  }, [handleBlur, setIsEdited, children])

  useEffect(() => {
    setValue(castChildren(children))
  }, [children])

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        setTimeout(() => {
          setLoading(false)
        }, 250)
      })
    }
  }, [hot])

  return (
    <div
      ref={finalRef}
      {...editionProps}
    >
      {loading ? appendCarriageReturn(value) : isEdited ? (
        <WithOutsideClick
          onOutsideClick={handleBlur}
        >
          <Input
            bare
            multiline
            autoFocus
            autoSelect
            width="100%"
            value={value}
            onChange={event => setValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={handleBlur}
          />
        </WithOutsideClick>
      ) : appendCarriageReturn(children)}
    </div>
  )
}

export default forwardRef(TextRef)
