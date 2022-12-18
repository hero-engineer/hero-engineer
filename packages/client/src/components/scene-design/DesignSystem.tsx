import { Div, H1 } from 'honorable'

import DesignSystemSectionTypography from '~components/scene-design/DesignSystemSectionTypography'
import DesignSystemSectionColors from '~components/scene-design/DesignSystemSectionColors'
import DesignSystemSectionSpacings from '~components/scene-design/DesignSystemSectionSpacings'

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
