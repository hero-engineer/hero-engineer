import { useCallback, useContext, useState } from 'react'
import { Button, Div, H2, Modal } from 'honorable'

import DragAndDropContext from '../../contexts/DragAndDropContext'
import { HierarchyPosition } from '../../types'
import { hierarchyPositions } from '../../constants'

import capitalize from '../utils/capitalize'

function DragAndDropEndModal() {
  const { dragAndDrop, setDragAndDrop } = useContext(DragAndDropContext)
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>('before')
  const clearDragAndDrop = useCallback(() => {
    setHierarchyPosition('before')
    setDragAndDrop({
      sourceHierarchyIds: [],
      targetHierarchyIds: [],
    })
  }, [setDragAndDrop])

  const submitDragAndDrop = useCallback(() => {

  }, [])

  console.log('hierarchyPosition', hierarchyPosition)

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
