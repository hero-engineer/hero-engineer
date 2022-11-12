import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, Modal, P, Tooltip } from 'honorable'
import { TbTrash } from 'react-icons/tb'

import { DeleteComponentMutation, DeleteComponentMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'

function DeleteComponentButton(props: any) {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const lastEditedHierarchyItem = useMemo(() => [...hierarchy].reverse().find(x => x.componentAddress), [hierarchy])
  const navigate = useNavigate()

  const [, deleteComponent] = useMutation<DeleteComponentMutationDataType>(DeleteComponentMutation)

  const handleDeleteComponentClick = useCallback(async () => {
    if (!isHierarchyOnComponent(hierarchy, componentAddress)) {
      setIsModalOpen(true)

      return
    }

    await deleteComponent({
      sourceComponentAddress: componentAddress,
      hierarchyIds,
      componentDelta,
    })

    setEditionSearchParams({
      hierarchyIds: [],
    })
  }, [hierarchy, componentDelta, componentAddress, deleteComponent, hierarchyIds, setEditionSearchParams])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsModalOpen(false)

    navigate(`/__ecu__/component/${lastEditedHierarchyItem?.componentAddress}`)
  }, [navigate, lastEditedHierarchyItem])

  if (!componentAddress) {
    return null
  }

  return (
    <>
      <Tooltip
        label="Delete component"
        placement="bottom"
      >
        <Button
          ghost
          onClick={handleDeleteComponentClick}
          disabled={!hierarchyIds.length}
          {...props}
        >
          <TbTrash />
        </Button>
      </Tooltip>
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
          {lastEditedHierarchyItem?.componentName}
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
            {lastEditedHierarchyItem?.componentName}
          </Button>
        </Div>
      </Modal>
    </>
  )
}

export default memo(DeleteComponentButton)
