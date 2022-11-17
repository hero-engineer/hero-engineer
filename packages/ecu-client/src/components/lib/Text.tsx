import { HTMLProps, KeyboardEvent, Ref, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'urql'

import { UpdateTextValueMutation, UpdateTextValueMutationDataType } from '../../queries'

import HotContext from '../../contexts/HotContext'

import useEditionProps from '../../hooks/useEditionProps'
import useForkedRef from '../../hooks/useForkedRef'

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
    edited,
    setEdited,
  } = useEditionProps<HTMLDivElement>(ecuId, className, true)
  const inputRef = useRef<HTMLInputElement>(null)
  const finalRef = useForkedRef(ref, editionRef)

  const [, updateTextValueMutation] = useMutation<UpdateTextValueMutationDataType>(UpdateTextValueMutation)

  const handleBlur = useCallback(async () => {
    if (value === children) {
      setEdited(false)

      return
    }

    setLoading(true)
    setEdited(false)

    const mutationResult = await updateTextValueMutation({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyId,
      value,
    })

    if (mutationResult.error) {
      setLoading(false)
    }
  }, [updateTextValueMutation, componentAddress, hierarchyId, value, children, setEdited])

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault()
      event.stopPropagation()
      handleBlur()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setEdited(false)
      setValue(children)
    }
  }, [handleBlur, setEdited, children])

  useEffect(() => {
    if (!(edited && inputRef.current)) return

    inputRef.current.focus()
    inputRef.current.select()
  }, [edited])

  useEffect(() => {
    if (hot) {
      hot.on('vite:beforeUpdate', () => {
        setTimeout(() => {
          setLoading(false)
        }, 250)
      })
    }
  }, [hot])

  if (editionClassName.includes('ecu-selected')) {
    console.log('loading, edited', loading, edited)
  }

  return (
    <div
      ref={finalRef}
      className={editionClassName}
      data-ecu={ecuId}
      data-ecu-hierarchy={hierarchyId}
      onClick={onClick}
    >
      {loading ? value : edited ? (
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
