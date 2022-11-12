import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, Menu, MenuItem, Modal, P, Select } from 'honorable'
import { TbRowInsertBottom } from 'react-icons/tb'

import { hierarchyPositions } from '../../constants'
import { HierarchyPosition } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'

import useEditionSearchParams from '../../hooks/useEditionSearchParams'

import { AddComponentMutation, ComponentsQuery, ComponentsQueryDataType } from '../../queries'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'

import capitalize from '../../utils/capitalize'

function AddComponentSection() {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedComponentAddress, setSelectedComponentId] = useState('')
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>(hierarchyPositions[0])
  const lastEditedComponent = useMemo(() => [...hierarchy].reverse().find(x => x.componentAddress), [hierarchy])
  const navigate = useNavigate()

  const [componentsQueryResult] = useQuery<ComponentsQueryDataType>({
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

    if (!lastEditedComponent) return

    navigate(`/__ecu__/component/${lastEditedComponent.fileAddress}/${lastEditedComponent.componentAddress}`)
  }, [navigate, lastEditedComponent])

  if (componentsQueryResult.fetching) {
    return null
  }
  if (componentsQueryResult.error) {
    return null
  }
  if (!componentsQueryResult.data?.components) {
    return null
  }
  if (!componentAddress) {
    return null
  }

  return (
    <>
      <Div
        xflex="y2s"
        flexGrow={1}
        gap={0.5}
      >
        <Menu>
          {componentsQueryResult.data.components.map(componentAndFile => (
            <MenuItem
              key={componentAndFile.component.address}
              onClick={() => setSelectedComponentId(componentAndFile.component.address)}
              backgroundColor={selectedComponentAddress === componentAndFile.component.address ? 'lighten(primary, 80)' : null}
            >
              {componentAndFile.component.payload.name}
            </MenuItem>
          ))}
        </Menu>
      </Div>
      <Div
        xflex="x4"
        flexShrink={0}
        gap={0.5}
        px={0.5}
      >
        <Select
          menuOnTop
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

export default AddComponentSection
