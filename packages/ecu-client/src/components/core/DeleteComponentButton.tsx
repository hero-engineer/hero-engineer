import { memo, useCallback, useContext } from 'react'
import { useMutation } from 'urql'
import { useParams } from 'react-router-dom'
import { Button } from 'honorable'
import { TbTrash } from 'react-icons/tb'

import { DeleteComponentMutation } from '../../queries'
import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'

function DeleteComponentButton() {
  const { id } = useParams()
  const { hierarchyIds } = useContext(HierarchyIdsContext)
  const [, deleteComponent] = useMutation(DeleteComponentMutation)

  const handleDeleteComponentClick = useCallback(() => {
    deleteComponent({
      sourceComponentAddress: id,
      hierarchyIds,
    })
  }, [deleteComponent, id, hierarchyIds])

  if (!id) {
    return null
  }

  return (
    <Button
      ghost
      onClick={handleDeleteComponentClick}
      disabled={!hierarchyIds.length}
    >
      <TbTrash />
    </Button>
  )
}

export default memo(DeleteComponentButton)
