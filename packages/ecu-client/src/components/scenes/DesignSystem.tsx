import { Div, H1 } from 'honorable'

import DesignSystemSectionTypography from '@core/design-system/DesignSystemSectionTypography'
import DesignSystemSectionColors from '@core/design-system/DesignSystemSectionColors'
import DesignSystemSectionSpacings from '@core/design-system/DesignSystemSectionSpacings'

// Design/system scene
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
        <DesignSystemSectionSpacings />
      </Div>
    </>
  )
}

export default DesignSystem
