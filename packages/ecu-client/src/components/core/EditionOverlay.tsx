import { ReactNode, useMemo, useState } from 'react'
import { Div } from 'honorable'

import { zIndexes } from '../../constants'

import EditionOverlayContext, { EditionOverlayContextType, ElementWithHierarchyId } from '../../contexts/EditionOverlayContext'

type EditionOverlayPropsType = {
  children: ReactNode
}

function EditionOverlay({ children }: EditionOverlayPropsType) {
  const [elementRegistry, setElementRegistry] = useState<ElementWithHierarchyId[]>([])
  const editionOverlayContextValue = useMemo<EditionOverlayContextType>(() => ({ elementRegistry, setElementRegistry }), [elementRegistry])

  console.log('elementRegistry', elementRegistry)

  return (
    <EditionOverlayContext.Provider value={editionOverlayContextValue}>
      <Div
        xflex="y2s"
        position="relative"
      >
        {children}
        <Div
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          zIndex={zIndexes.editionOverlay}
          backgroundColor="transparency(black, 50)"
        />
      </Div>
    </EditionOverlayContext.Provider>
  )
}

export default EditionOverlay
