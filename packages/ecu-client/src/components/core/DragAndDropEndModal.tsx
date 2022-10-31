import { useCallback, useContext, useState } from 'react'
import { useMutation } from 'urql'
import { Button, Div, H2, Modal } from 'honorable'

import { useParams } from 'react-router-dom'

import DragAndDropContext from '../../contexts/DragAndDropContext'
import { HierarchyPosition } from '../../types'
import { hierarchyPositions } from '../../constants'

import { MoveComponentMutation } from '../../queries'

import capitalize from '../utils/capitalize'

function DragAndDropEndModal() {
  const { id = '' } = useParams()
  const { dragAndDrop, setDragAndDrop } = useContext(DragAndDropContext)
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>('before')

  const [, moveComponent] = useMutation(MoveComponentMutation)

  const clearDragAndDrop = useCallback(() => {
    setHierarchyPosition('before')
    setDragAndDrop({
      sourceHierarchyIds: [],
      targetHierarchyIds: [],
    })
  }, [setDragAndDrop])

  const submitDragAndDrop = useCallback(async () => {
    await moveComponent({
      sourceComponentAddress: id,
      sourceHierarchyIds: dragAndDrop.sourceHierarchyIds,
      targetHierarchyIds: dragAndDrop.targetHierarchyIds,
      hierarchyPosition,
    })

    clearDragAndDrop()
  }, [moveComponent, id, dragAndDrop, hierarchyPosition, clearDragAndDrop])

  if (!id) {
    return null
  }

  return (
    <Modal
      open={!!(dragAndDrop.sourceHierarchyIds.length && dragAndDrop.targetHierarchyIds.length)}
      onClose={clearDragAndDrop}
    >
      <H2>Complete component move</H2>
      <Div
        xflex="x4"
        gap={1}
        mt={2}
      >
        {hierarchyPositions.map(position => (
          <Div
            key={position}
            onClick={() => setHierarchyPosition(position)}
            textDecoration={hierarchyPosition === position ? 'underline' : 'none'}
          >
            {capitalize(position)}
          </Div>
        ))}
      </Div>
      <Div
        xflex="x6"
        gap={1}
        mt={2}
      >
        <Button onClick={clearDragAndDrop}>
          Cancel
        </Button>
        <Button onClick={submitDragAndDrop}>
          Move component
        </Button>
      </Div>
    </Modal>
  )
}

export default DragAndDropEndModal
