import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { VscGithubAction } from 'react-icons/vsc'

import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'

// A button that links to the components scene
function InteractiveModeButton(props: any) {
  const { '*': componentRelativePath = '' } = useParams()
  const { isInteractiveMode, setIsInteractiveMode } = useContext(IsInteractiveModeContext)

  if (!componentRelativePath) return null

  return (
    <Tooltip
      label={`${isInteractiveMode ? 'Disable' : 'Enable'} interactive mode`}
      placement="bottom-end"
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

export default InteractiveModeButton
