import { Button, Div, Tooltip } from 'honorable'
import { useCallback } from 'react'
import { BiRedo, BiUndo } from 'react-icons/bi'

function UndoRedoButtons() {

  const handleUndoClick = useCallback(() => {

  }, [])

  const handleRedoClick = useCallback(() => {

  }, [])

  return (
    <Div xflex="x4">
      <Tooltip
        label="Undo"
        placement="bottom"
      >
        <Button
          ghost
          borderLeft="1px solid border"
          onClick={handleUndoClick}
        >
          <BiUndo />
        </Button>
      </Tooltip>
      <Tooltip
        label="Redo"
        placement="bottom"
      >
        <Button
          ghost
          borderLeft="1px solid border"
          onClick={handleRedoClick}
        >
          <BiRedo />
        </Button>
      </Tooltip>
    </Div>
  )
}

export default UndoRedoButtons
