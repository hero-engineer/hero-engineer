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

  const [, drop] = useDrop({
    accept: 'component',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      const mouse = monitor.getClientOffset()
      let position = mouse.y - item.rect.top < item.rect.height / 2 ? 'before' : 'after' as 'before' | 'after'

      const indexArray = index.split('.')
      let lastIndex = parseInt(indexArray.pop())

      if (position === 'before') lastIndex--
      else lastIndex++

      const nextIndex = [...indexArray, lastIndex].join('.')

      if (index === item.index || nextIndex === item.index) {
        position = null
      }

      setEcu(ecu => ({
        ...ecu,
        dragState: {
          ...ecu.dragState,
          sourceIndex: item.index,
          targetIndex: index,
          position,
          rect: item.rect,
        },
      }))
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: () => ({ index, rect: childrenRef.current.getBoundingClientRect() }),
    collect: monitor => ({ isDragging: monitor.isDragging() }),
    end() {
      const { sourceIndex, targetIndex, position } = ecu.dragState

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

      console.log('drop', sourceIndex, targetIndex, position)

      if (sourceIndex && targetIndex && position) {
        client.mutate({
          mutation: DRAG_COMPONENT_MUTATION,
          variables: {
            sourceIndex,
            targetIndex,
            position,
          },
        })
      }
    },
  })

  drag(drop(childrenRef))

  function handleMouseDown() {
    setEcu(ecu => ({
      ...ecu,
      activeComponentIndex: index,
    }))
  }

  return (
    <Div
      ecu={index}
      ref={ref}
    >
      {ecu.dragState.targetIndex === index && ecu.dragState.position === 'before' && (
        <Div
          width={ecu.dragState.rect.width}
          height={ecu.dragState.rect.height}
          backgroundColor="gold"
        />
      )}
      <Div
        ref={childrenRef}
        m="-1px"
        borderStyle="solid"
        borderWidth={1}
        borderColor={ecu.activeComponentIndex === index ? 'gold' : 'transparent'}
        onMouseDown={handleMouseDown}
      >
        {children}
      </Div>
      {ecu.dragState.targetIndex === index && ecu.dragState.position === 'after' && (
        <Div
          width={ecu.dragState.rect.width}
          height={ecu.dragState.rect.height}
          backgroundColor="gold"
        />
      )}
    </Div>
  )
}

export default forwardRef(EcuEditorRef)
