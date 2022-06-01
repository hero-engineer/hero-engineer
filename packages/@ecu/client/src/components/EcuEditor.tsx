import { PropsWithChildren, Ref, forwardRef, useContext, useEffect, useRef } from 'react'
import { useApolloClient } from '@apollo/client'
import { useDrag, useDrop } from 'react-dnd'

import { Div } from 'honorable'

import { DRAG_COMPONENT_MUTATION } from '../queries'

import EcuContext from '../contexts/EcuContext'

type EcuEditorProps = PropsWithChildren<{
  index: string
}>

function EcuEditorRef({ children, index }: EcuEditorProps, ref: Ref<any>) {
  const client = useApolloClient()
  const childrenRef = useRef<HTMLDivElement>()
  const [ecu, setEcu] = useContext(EcuContext)
  const { sourceIndex, targetIndex, mouse, rect: dragRect, position } = ecu.dragState

  useEffect(() => {
    if (!childrenRef.current) return

    if (targetIndex === index) {
      // console.log(index, position, sourceIndex)
      const rect = childrenRef.current.getBoundingClientRect()

      setEcu(ecu => ({
        ...ecu,
        dragState: {
          ...ecu.dragState,
          position: mouse.y - rect.top < rect.height / 2 ? 'before' : 'after',
        },
      }))
    }
  }, [targetIndex, index, mouse, setEcu])

  const [, drop] = useDrop({
    accept: 'component',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(_item: any, monitor) {
      // console.log('index', index)
      setEcu(ecu => ({
        ...ecu,
        dragState: {
          ...ecu.dragState,
          targetIndex: index,
          mouse: monitor.getClientOffset(),
        },
      }))
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: () => index === ecu.component.index ? { id: index, index } : null,
    collect: monitor => ({ isDragging: monitor.isDragging() }),
    end: () => {
      if (sourceIndex && targetIndex && position) {
        client.mutate({
          mutation: DRAG_COMPONENT_MUTATION,
          variables: {
            name: ecu.component.name,
            sourceIndex,
            targetIndex,
            position,
          },
        })
      }

      setEcu(ecu => ({
        ...ecu,
        dragState: {
          ...ecu.dragState,
          rect: null,
          sourceIndex: null,
          targetIndex: null,
          position: null,
        },
      }))
    },
  })

  useEffect(() => {
    if (!childrenRef.current) return
    if (isDragging) {
      setEcu(ecu => ({
        ...ecu,
        dragState: {
          ...ecu.dragState,
          rect: childrenRef.current.getBoundingClientRect(),
          sourceIndex: index,
        },
      }))
    }
  }, [isDragging, setEcu, index])

  drag(drop(childrenRef))

  function handleClick() {
    setEcu(ecu => ({
      ...ecu,
      component: {
        ...ecu.component,
        index,
        name: 'MyComponent',
      },
    }))
  }

  return (
    <Div
      ecu={index}
      ref={ref}
    >
      {targetIndex === index && position === 'before' && (
        <Div
          width={dragRect.width}
          height={dragRect.height}
          backgroundColor="chartreuse"
        />
      )}
      <Div
        ref={childrenRef}
        p={0.5}
        borderStyle="solid"
        borderWidth={1}
        borderColor={ecu.component.index === index ? 'gold' : 'transparent'}
        onClick={handleClick}
      >
        {children}
      </Div>
      {targetIndex === index && position === 'after' && (
        <Div
          width={dragRect.width}
          height={dragRect.height}
          backgroundColor="pink"
        />
      )}
    </Div>
  )
}

export default forwardRef(EcuEditorRef)
