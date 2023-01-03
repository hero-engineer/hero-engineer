import { Div } from 'honorable'

import InteractiveModeButton from '~components/scene-component/controls/InteractiveModeButton'
import RemountButton from '~components/scene-component/controls/RemountButton'
import BreakpointsButtons from '~components/scene-component/controls/BreakpointsButtons'

function ControlsBar() {

  return (
    <Div
      xflex="x4"
      height={32}
      backgroundColor="background-light"
      borderBottom="1px solid border"
    >
      <InteractiveModeButton
        borderRight="1px solid border"
      />
      <RemountButton
        borderRight="1px solid border"
      />
      <Div flexGrow />
      <BreakpointsButtons />
      <Div flexGrow />
    </Div>
  )
}

export default ControlsBar
