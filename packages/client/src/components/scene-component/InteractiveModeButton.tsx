import { memo, useContext } from 'react'
import { Button, Tooltip } from 'honorable'
import { VscGithubAction } from 'react-icons/vsc'

import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'

function InteractiveModeButton(props: any) {
  const { isInteractiveMode, setIsInteractiveMode } = useContext(IsInteractiveModeContext)

  return (
    <Tooltip
      label={`${isInteractiveMode ? 'Disable' : 'Enable'} interactive mode`}
      placement="bottom"
    >
      <Button
        ghost
        toggled={isInteractiveMode}
        onClick={() => setIsInteractiveMode(x => !x)}
        {...props}
      >
        <VscGithubAction />
      </Button>
    </Tooltip>
  )
}

export default memo(InteractiveModeButton)
