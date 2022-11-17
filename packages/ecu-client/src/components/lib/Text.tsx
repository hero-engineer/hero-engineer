import { HTMLProps, KeyboardEvent, Ref, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'urql'

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

// TODO use a preprocessor before production build to replace Text with a regular Div
function TextRef({ 'data-ecu': ecuId, className, children }: TextPropsType, ref: Ref<any>) {
  const { componentAddress = '' } = useParams()
  const hot = useContext(HotContext)
  const [value, setValue] = useState(children)
  const [loading, setLoading] = useState(false)
  const {
    ref: editionRef,
    className: editionClassName,
    hierarchyId,
    onClick,
    isEdited,
    setIsEdited,
  } = useEditionProps<HTMLDivElement>(ecuId, className, true)
  const inputRef = useRef<HTMLInputElement>(null)
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

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
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
    if (!(isEdited && inputRef.current)) return

    inputRef.current.focus()
    inputRef.current.select()
  }, [isEdited])

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
      className={editionClassName}
      data-ecu={ecuId}
      data-ecu-hierarchy={hierarchyId}
      onClick={onClick}
    >
      {loading ? value : isEdited ? (
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="ecu-text-input"
        />
      ) : children}
    </div>
  )
}

export default forwardRef(TextRef)
