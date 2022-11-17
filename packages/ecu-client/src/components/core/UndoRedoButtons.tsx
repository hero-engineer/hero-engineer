import { useCallback, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { Button, Div, Tooltip } from 'honorable'
import { BiRedo, BiUndo } from 'react-icons/bi'

import {
  CanRedoQuery,
  CanRedoQueryDataType,
  RedoMutation,
  RedoMutationDataType,
  UndoMutation,
  UndoMutationDataType,
} from '../../queries'

import useRefetch from '../../hooks/useRefetch'
import { refetchKeys } from '../../constants'

function UndoRedoButtons() {
  const [loading, setLoading] = useState(false)

  const [canRedoQueryResults, refetchCanRedoQuery] = useQuery<CanRedoQueryDataType>({
    query: CanRedoQuery,
  })
  const [, undoMutation] = useMutation<UndoMutationDataType>(UndoMutation)
  const [, redoMutation] = useMutation<RedoMutationDataType>(RedoMutation)

  const refetch = useRefetch({
    key: refetchKeys.canRedo,
    refetch: refetchCanRedoQuery,
  })

  const handleUndoClick = useCallback(async () => {
    setLoading(true)
    await undoMutation()
    setLoading(false)
    refetch(refetchKeys.all)
  }, [undoMutation, refetch])

  const handleRedoClick = useCallback(async () => {
    setLoading(true)
    await redoMutation()
    setLoading(false)
    refetch(refetchKeys.all)
  }, [redoMutation, refetch])

  return (
    <Div xflex="x4">
      <Tooltip
        label="Undo"
        placement="bottom-end"
      >
        <Button
          ghost
          borderLeft="1px solid border"
          onClick={handleUndoClick}
          loading={loading}
          spinnerColor="text"
        >
          <BiUndo />
        </Button>
      </Tooltip>
      <Tooltip
        label="Redo"
        placement="bottom-end"
      >
        <Button
          ghost
          borderLeft="1px solid border"
          onClick={handleRedoClick}
          disabled={!canRedoQueryResults.data?.canRedo}
          loading={loading}
          spinnerColor="text"
        >
          <BiRedo />
        </Button>
      </Tooltip>
    </Div>
  )
}

export default UndoRedoButtons
