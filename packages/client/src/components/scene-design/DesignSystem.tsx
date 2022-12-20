import { useState } from 'react'
import { Button, Div, H1 } from 'honorable'

import DesignSystemIsEditModeContext from '~contexts/DesignSystemIsEditModeContext'

import DesignSystemSectionTypography from '~components/scene-design/DesignSystemSectionTypography'
import DesignSystemSectionColors from '~components/scene-design/DesignSystemSectionColors'
import DesignSystemSectionSpacings from '~components/scene-design/DesignSystemSectionSpacings'

// Design/system scene
function DesignSystem() {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <>
      <Div
        xflex="x5b"
        gap={1}
        mb={2}
      >
        <H1>
          Design System
        </H1>
        <Button onClick={() => setIsEditMode(x => !x)}>
          {isEditMode ? 'End editing' : 'Edit'}
        </Button>
      </Div>
      <Div
        xflex="y2s"
        gap={2}
        pb={6}
      >
        <DesignSystemIsEditModeContext.Provider value={isEditMode}>
          <DesignSystemSectionTypography />
          <DesignSystemSectionColors />
          <DesignSystemSectionSpacings />
        </DesignSystemIsEditModeContext.Provider>
      </Div>
    </>
  )
}

export default DesignSystem
