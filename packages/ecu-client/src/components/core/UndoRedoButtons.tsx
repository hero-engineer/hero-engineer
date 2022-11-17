import { useCallback } from 'react'
import { useMutation } from 'urql'
import { Button, Div, Tooltip } from 'honorable'
import { BiRedo, BiUndo } from 'react-icons/bi'

import {
  RedoMutation,
  RedoMutationDataType,
  UndoMutation,
  UndoMutationDataType,
} from '../../queries'

function UndoRedoButtons() {
  const [, undoMutation] = useMutation<UndoMutationDataType>(UndoMutation)
  const [, redoMutation] = useMutation<RedoMutationDataType>(RedoMutation)

  const handleUndoClick = useCallback(() => {
    undoMutation()
  }, [undoMutation])

  const handleRedoClick = useCallback(() => {
    redoMutation()
  }, [redoMutation])

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
