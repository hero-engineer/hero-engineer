import { MouseEvent, useCallback, useContext } from 'react'

import EditionContext from '../contexts/EditionContext'

const selectionStyles = {
  outline: '1px solid lightblue',
}

function useEditionProps(id: string) {
  const { selectedId, setSelectedId } = useContext(EditionContext)

  const handleClick = useCallback((event: MouseEvent) => {
    console.log('id', id)

    if (selectedId === id) {
      event.stopPropagation()

      return
    }

    setSelectedId(id)
  }, [selectedId, setSelectedId, id])

  return {
    onClick: handleClick,
    style: {
      userSelect: 'none' as any,
      ...(selectedId === id ? selectionStyles : {}),
    },
  }
}

export default useEditionProps
