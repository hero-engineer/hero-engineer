import { memo, useContext } from 'react'
import { Div, P } from 'honorable'

import AstsContext from '~contexts/AstsContext'

import useCurrentComponentPath from '~hooks/useCurrentComponentPath'

// The hierarchy section
// Displayed in the left panel
function PanelHierarchy() {
  // const { asts} = useContext(AstsContext)
  const path = useCurrentComponentPath()

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256 - 1} // Minus 1 to align with the top bar
      overflowY="auto"
    >
      <P
        fontWeight="bold"
        userSelect="none"
        px={1}
        mt={0.5}
        mb={0.5}
      >
        Hierarchy
      </P>
      <Div
        flexGrow
        overflowY="auto"
        pb={2}
        pl={1}
      >
        PanelHierarchy
      </Div>
    </Div>
  )
}

export default memo(PanelHierarchy)
