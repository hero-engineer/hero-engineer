import { useCallback, useContext, useMemo, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, Modal, P, Tooltip } from 'honorable'
import { TbTrash } from 'react-icons/tb'

import { refetchKeys } from '../../constants'

import { DeleteComponentMutation, DeleteComponentMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'

import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'
import getLastEditedHierarchyItem from '../../helpers/getLastEditedHierarchyItem'

// TODO : deprecate in favor of context menu
function DeleteComponentButton(props: any) {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const lastEditedHierarchyItem = useMemo(() => getLastEditedHierarchyItem(hierarchy), [hierarchy])
  const navigate = useNavigate()

  const [, deleteComponent] = useMutation<DeleteComponentMutationDataType>(DeleteComponentMutation)

  const refetch = useRefetch()

  const handleDeleteComponentClick = useCallback(async () => {
    if (!isHierarchyOnComponent(hierarchy, componentAddress)) {
      setIsModalOpen(true)

      return
    }

    await deleteComponent({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyIds[hierarchyIds.length - 1],
      componentDelta,
    })

    setEditionSearchParams({
      hierarchyIds: [],
    })

    refetch(refetchKeys.hierarchy)
    refetch(refetchKeys.componentScreenshot)
  }, [hierarchy, componentDelta, componentAddress, deleteComponent, hierarchyIds, setEditionSearchParams, refetch])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsModalOpen(false)

    navigate(`/_ecu_/component/${lastEditedHierarchyItem?.componentAddress}`)
  }, [navigate, lastEditedHierarchyItem])

  if (!componentAddress) {
    return null
  }

  return (
    <>
      <Tooltip
        label="Delete component"
        placement="bottom-start"
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

export default DeleteComponentButton
