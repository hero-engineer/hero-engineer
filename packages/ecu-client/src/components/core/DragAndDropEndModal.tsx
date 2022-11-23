import { memo, useCallback, useContext, useState } from 'react'
import { useMutation } from 'urql'
import { Button, Div, H2, Modal } from 'honorable'

import { useParams } from 'react-router-dom'

import DragAndDropContext from '../../contexts/DragAndDropContext'
import { HierarchyPosition } from '../../types'
import { hierarchyPositions } from '../../constants'

import { MoveComponentMutation, MoveComponentMutationDataType } from '../../queries'

import capitalize from '../../utils/capitalize'

// A modal that informs that a dnd operation is not possible
function DragAndDropEndModal() {
  const { componentAddress = '' } = useParams()
  const { dragAndDrop, setDragAndDrop } = useContext(DragAndDropContext)
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>('before')

  const [, moveComponent] = useMutation<MoveComponentMutationDataType>(MoveComponentMutation)

  const clearDragAndDrop = useCallback(() => {
    setHierarchyPosition('before')
    setDragAndDrop({
      sourceHierarchyId: '',
      targetHierarchyId: '',
    })
  }, [setDragAndDrop])

  const submitDragAndDrop = useCallback(async () => {
    await moveComponent({
      sourceComponentAddress: componentAddress,
      sourceHierarchyId: dragAndDrop.sourceHierarchyId,
      targetHierarchyId: dragAndDrop.targetHierarchyId,
      hierarchyPosition,
    })

    clearDragAndDrop()
  }, [moveComponent, componentAddress, dragAndDrop, hierarchyPosition, clearDragAndDrop])

  if (!componentAddress) {
    return null
  }

  return (
    <Modal
      open={false}
      // open={!!(dragAndDrop.sourceHierarchyId && dragAndDrop.targetHierarchyId)}
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

export default memo(DragAndDropEndModal)
