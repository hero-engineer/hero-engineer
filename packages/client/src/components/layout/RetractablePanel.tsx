import { ReactNode, useContext } from 'react'
import { Div } from 'honorable'

import { zIndexes } from '~constants'

import ComponentPanelsContext from '~contexts/ComponentPanelsContext'

type RetractablePanelPropsType = {
  direction: 'left' | 'right' | string
  items: Record<string, ReactNode>
}

// A panel that can be opened and closed on the side of the screen
function RetractablePanel({ direction, items }: RetractablePanelPropsType) {
  const isLeft = direction === 'left'
  const contextKey = isLeft ? 'leftKey' : 'rightKey'
  const { [contextKey]: itemKey } = useContext(ComponentPanelsContext)

  return (
    <Div
      xflex="y2s"
      width="fit-content"
      height="100%"
      maxHeight="100%"
      backgroundColor="background-light"
      borderRight={isLeft ? '1px solid border' : null}
      borderLeft={!isLeft ? '1px solid border' : null}
      overflowY="auto"
      zIndex={zIndexes.retractablePanel}
    >
      {items[itemKey] || null}
    </Div>
  )
}

export default RetractablePanel
