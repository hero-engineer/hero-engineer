import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, Modal, P } from 'honorable'
import { TbTrash } from 'react-icons/tb'

import { DeleteComponentMutation } from '../../queries'

import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'
import HierarchyContext from '../../contexts/HierarchyContext'

function DeleteComponentButton(props: any) {
  const { id = '' } = useParams()
  const { hierarchyIds, setHierarchyIds } = useContext(HierarchyIdsContext)
  const { hierarchy, componentDelta, isHierarchyOnComponent } = useContext(HierarchyContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const lastEditedComponent = useMemo(() => [...hierarchy].reverse().find(x => x.componentAddress), [hierarchy])
  const navigate = useNavigate()

  const [, deleteComponent] = useMutation(DeleteComponentMutation)

  const handleDeleteComponentClick = useCallback(async () => {
    if (!isHierarchyOnComponent) {
      setIsModalOpen(true)

      return
    }

    await deleteComponent({
      sourceComponentAddress: id,
      hierarchyIds,
      componentDelta,
    })

    setHierarchyIds([])
  }, [id, deleteComponent, hierarchyIds, componentDelta, isHierarchyOnComponent, setHierarchyIds])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsModalOpen(false)

    navigate(`/__ecu__/component/${lastEditedComponent?.componentAddress}`)
  }, [navigate, lastEditedComponent])

  if (!id) {
    return null
  }

  return (
    <>
      <Button
        ghost
        onClick={handleDeleteComponentClick}
        disabled={!hierarchyIds.length}
        {...props}
      >
        <TbTrash />
      </Button>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <H3>Cannot delete component</H3>
        <P mt={2}>
          You are currently editing
          {' '}
          {hierarchy[0]?.componentName}
        </P>
        <P mt={1}>
          To delete
          {' '}
          {hierarchy[hierarchy.length - 1]?.componentName}
          {' '}
          you must edit
          {' '}
          {lastEditedComponent?.componentName}
          .
        </P>
        <Div
          xflex="x6"
          mt={2}
          gap={0.5}
        >
          <Button onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button onClick={navigateToLastEditedComponent}>
            Go to
            {' '}
            {lastEditedComponent?.componentName}
          </Button>
        </Div>
      </Modal>
    </>
  )
}

export default memo(DeleteComponentButton)
