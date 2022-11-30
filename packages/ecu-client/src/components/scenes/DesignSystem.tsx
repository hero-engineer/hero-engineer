import { Div, H1 } from 'honorable'

import DesignSystemSectionTypography from '../core/DesignSystemSectionTypography'
import DesignSystemSectionColors from '../core/DesignSystemSectionColors'

// Design scene
function DesignSystem() {
  return (
    <>
      <H1 mb={2}>Design System</H1>
      <Div
        xflex="y2s"
        gap={2}
        pb={6}
      >
        <DesignSystemSectionTypography />
        <DesignSystemSectionColors />
      </Div>
    </>
  )
}

export default DesignSystem
