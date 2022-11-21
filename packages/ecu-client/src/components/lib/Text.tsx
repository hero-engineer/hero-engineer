import { HTMLProps, KeyboardEvent, Ref, forwardRef, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'urql'
import TextareaAutosize from 'react-textarea-autosize'

import { WithOutsideClick } from 'honorable'

import { refetchKeys } from '../../constants'

import { UpdateTextValueMutation, UpdateTextValueMutationDataType } from '../../queries'

import HotContext from '../../contexts/HotContext'

import useEditionProps from '../../hooks/useEditionProps'
import useForkedRef from '../../hooks/useForkedRef'
import useRefetch from '../../hooks/useRefetch'

type TextPropsType = HTMLProps<HTMLDivElement> & {
  'data-ecu': string
  children: string
}

const appendCarriageReturn = (x: string) => typeof x === 'string' ? `${x}\n` : x

// A text component
// TODO use a preprocessor before production build to replace Text with a regular Div
function TextRef({ 'data-ecu': ecuId, className, children }: TextPropsType, ref: Ref<any>) {
  const { componentAddress = '' } = useParams()
  const hot = useContext(HotContext)
  const [value, setValue] = useState(children)
  const [loading, setLoading] = useState(false)
  const {
    ref: editionRef,
    hierarchyId,
    isEdited,
    setIsEdited,
    editionProps,
  } = useEditionProps<HTMLDivElement>(ecuId, className, true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const finalRef = useForkedRef(ref, editionRef)

  const [, updateTextValueMutation] = useMutation<UpdateTextValueMutationDataType>(UpdateTextValueMutation)

  const refetch = useRefetch()

  const handleBlur = useCallback(async () => {
    if (value === children) {
      setIsEdited(false)

      return
    }

    setLoading(true)
    setIsEdited(false)

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
  }, [updateTextValueMutation, componentAddress, hierarchyId, value, children, setIsEdited, refetch])

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (((event.shiftKey || event.ctrlKey || event.metaKey) && event.key === 'Enter') || event.key === 'Tab') {
      event.preventDefault()
      event.stopPropagation()
      handleBlur()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setIsEdited(false)
      setValue(children)
    }
  }, [handleBlur, setIsEdited, children])

  useEffect(() => {
    setValue(children)
  }, [children])

  // useEffect(() => {
  //   if (!(isEdited && inputRef.current)) return

  //   inputRef.current.focus()
  //   inputRef.current.select()
  // }, [isEdited])

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
          <TextareaAutosize
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="ecu-text-input"
          />
        </WithOutsideClick>
      ) : appendCarriageReturn(children)}
    </div>
  )
}

export default forwardRef(TextRef)
