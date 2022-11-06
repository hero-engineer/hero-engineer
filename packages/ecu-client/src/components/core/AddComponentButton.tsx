import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, MenuItem, Modal, P, Select } from 'honorable'
import { TbRowInsertBottom } from 'react-icons/tb'

import { hierarchyPositions } from '../../constants'
import { HierarchyPosition } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'

import useEditionSearchParams from '../../hooks/useEditionSearchParams'

import { AddComponentMutation, ComponentsQuery } from '../../queries'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'

import capitalize from '../../utils/capitalize'

function AddComponentButton() {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedComponentAddress, setSelectedComponentId] = useState('')
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>(hierarchyPositions[0])
  const lastEditedComponent = useMemo(() => [...hierarchy].reverse().find(x => x.componentAddress), [hierarchy])
  const navigate = useNavigate()

  const [componentsQueryResult] = useQuery({
    query: ComponentsQuery,
  })
  const [, addComponent] = useMutation(AddComponentMutation)

  const handleAddComponentClick = useCallback(() => {
    if (!isHierarchyOnComponent(hierarchy, componentAddress)) {
      setIsModalOpen(true)

      return
    }

    addComponent({
      sourceComponentAddress: componentAddress,
      targetComponentAddress: selectedComponentAddress,
      hierarchyIds,
      hierarchyPosition,
      componentDelta,
    })
  }, [hierarchy, componentDelta, componentAddress, addComponent, selectedComponentAddress, hierarchyIds, hierarchyPosition])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsModalOpen(false)

    navigate(`/__ecu__/component/${lastEditedComponent?.componentAddress}`)
  }, [navigate, lastEditedComponent])

  if (componentsQueryResult.fetching) {
    return null
  }
  if (componentsQueryResult.error) {
    return null
  }
  if (!componentAddress) {
    return null
  }

  return (
    <>
      <Div
        xflex="x4"
        gap={0.5}
      >
        <Select
          value={selectedComponentAddress}
          onChange={event => setSelectedComponentId(event.target.value)}
        >
          <MenuItem value="">
            Select a component
          </MenuItem>
          {componentsQueryResult.data.components.map((component: any) => (
            <MenuItem
              key={component.address}
              value={component.address}
            >
              {component.payload.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={hierarchyPosition}
          onChange={event => setHierarchyPosition(event.target.value)}
        >
          {hierarchyPositions.map(hierarchyPosition => (
            <MenuItem
              key={hierarchyPosition}
              value={hierarchyPosition}
            >
              {capitalize(hierarchyPosition)}
            </MenuItem>
          ))}
        </Select>
        <Button
          ghost
          onClick={handleAddComponentClick}
          disabled={!(selectedComponentAddress && hierarchyIds.length)}
        >
          <TbRowInsertBottom />
        </Button>
      </Div>
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
          To add a component here, you must edit
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

export default memo(AddComponentButton)
