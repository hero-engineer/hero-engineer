import { memo, useContext } from 'react'
import { useMutation } from 'urql'
import { useParams } from 'react-router-dom'
import { Button } from 'honorable'

import { DeleteComponentMutation } from '../../queries'
import EditionContext from '../../contexts/EditionContext'

function DeleteComponentButton() {
  const { id } = useParams()
  const { hierarchyIds } = useContext(EditionContext)
  const [, deleteComponent] = useMutation(DeleteComponentMutation)

  function handleDeleteComponentClick() {
    deleteComponent({
      sourceComponentId: id,
      hierarchyIds,
    })
  }

  if (!id) {
    return null
  }

  return (
    <Button
      onClick={handleDeleteComponentClick}
      disabled={!hierarchyIds.length}
    >
      Delete component
    </Button>
  )
}

export default memo(DeleteComponentButton)
