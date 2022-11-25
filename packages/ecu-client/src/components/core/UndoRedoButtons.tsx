import { useCallback, useMemo, useState } from 'react'

import { Button, Div, Tooltip } from 'honorable'

import { BiRedo, BiUndo } from 'react-icons/bi'

import { refetchKeys } from '../../constants'

import {
  RedoMutation,
  RedoMutationDataType,
  UndoMutation,
  UndoMutationDataType,
  UndoRedoMetadastaQueryDataType,
  UndoRedoMetadataQuery,
} from '../../queries'

import useQuery from '../../hooks/useQuery'
import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'

// The undo/redo buttons
function UndoRedoButtons() {
  const [loading, setLoading] = useState(false)

  const [undoRedoMetadataQueryResults, refetchUndoRedoMetadataQuery] = useQuery<UndoRedoMetadastaQueryDataType>({
    query: UndoRedoMetadataQuery,
  })
  const [, undoMutation] = useMutation<UndoMutationDataType>(UndoMutation)
  const [, redoMutation] = useMutation<RedoMutationDataType>(RedoMutation)

  const undoMessage = useMemo(() => undoRedoMetadataQueryResults.data?.undoRedoMetadata?.undoMessage, [undoRedoMetadataQueryResults.data])
  const redoMessage = useMemo(() => undoRedoMetadataQueryResults.data?.undoRedoMetadata?.redoMessage, [undoRedoMetadataQueryResults.data])

  const refetch = useRefetch({
    key: refetchKeys.undoRedoMetadata,
    refetch: refetchUndoRedoMetadataQuery,
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
        label={`Undo ${undoMessage}`}
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
        label={`Redo ${redoMessage}`}
        placement="bottom-end"
      >
        <Button
          ghost
          borderLeft="1px solid border"
          onClick={handleRedoClick}
          disabled={!redoMessage}
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
