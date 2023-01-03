import { useContext } from 'react'
import { Button, Div, Tooltip } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'
import { MdBrush } from 'react-icons/md'

import ComponentPanelsContext from '~contexts/ComponentPanelsContext'

import InteractiveModeButton from '~components/scene-component/controls/InteractiveModeButton'
import RemountButton from '~components/scene-component/controls/RemountButton'
import BreakpointsButtons from '~components/scene-component/controls/BreakpointsButtons'

function ControlsBar() {
  const { setLeftKey, setRightKey } = useContext(ComponentPanelsContext)

  return (
    <Div
      xflex="x4"
      height={32}
      backgroundColor="background-light"
      borderBottom="1px solid border"
    >
      <Tooltip
        label="Hierarchy"
        placement="bottom"
      >
        <Button
          ghost
          onClick={() => setLeftKey('hierarchy')}
          borderRight="1px solid border"
        >
          <RiNodeTree />
        </Button>
      </Tooltip>
      <Tooltip
        label="Styles"
        placement="bottom"
      >
        <Button
          ghost
          onClick={() => setRightKey('styles')}
          borderRight="1px solid border"
        >
          <MdBrush />
        </Button>
      </Tooltip>
      <Div flexGrow />
      <BreakpointsButtons />
      <Div flexGrow />
      <InteractiveModeButton borderLeft="1px solid border" />
      <RemountButton borderLeft="1px solid border" />
    </Div>
  )
}

export default ControlsBar
