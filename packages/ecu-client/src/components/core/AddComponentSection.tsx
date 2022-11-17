import { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, Menu, MenuItem, Modal, P, Select } from 'honorable'
import { TbRowInsertBottom } from 'react-icons/tb'
import { VscTypeHierarchySub } from 'react-icons/vsc'

import { hierarchyPositions, refetchKeys } from '../../constants'
import { HierarchyPosition } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'

import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'

import { AddComponentMutation, ComponentsQuery, ComponentsQueryDataType } from '../../queries'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'
import getLastEditedHierarchyItem from '../../helpers/getLastEditedHierarchyItem'

import capitalize from '../../utils/capitalize'

function AddComponentSection() {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false)
  const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false)
  const [selectedComponentAddress, setSelectedComponentId] = useState('')
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>(hierarchyPositions[0])

  const lastEditedHierarchyItem = useMemo(() => getLastEditedHierarchyItem(hierarchy), [hierarchy])
  const lastHierarchyItem = useMemo(() => hierarchy[hierarchy.length - 1], [hierarchy])

  const navigate = useNavigate()

  const [componentsQueryResult, refetchComponentsQuery] = useQuery<ComponentsQueryDataType>({
    query: ComponentsQuery,
  })
  const [, addComponent] = useMutation(AddComponentMutation)

  const refetch = useRefetch({
    key: refetchKeys.components,
    refetch: refetchComponentsQuery,
    skip: !componentAddress,
  })

  const handleAddComponentClick = useCallback(async () => {
    if (!lastHierarchyItem.isComponentAcceptingChildren && hierarchyPosition === 'children') {
      setIsChildrenModalOpen(true)

      return
    }

    console.log('hierarchy[hierarchy.length - 1]', hierarchy[hierarchy.length - 1])

    if (!isHierarchyOnComponent(hierarchy, componentAddress)) {
      setIsComponentModalOpen(true)

      return
    }

    await addComponent({
      sourceComponentAddress: componentAddress,
      targetComponentAddress: selectedComponentAddress,
      targetHierarchyId: hierarchyIds[hierarchyIds.length - 1],
      hierarchyPosition,
      componentDelta,
    })

    refetch(refetchKeys.hierarchy)
  }, [
    lastHierarchyItem,
    addComponent,
    componentAddress,
    componentDelta,
    hierarchy,
    hierarchyIds,
    hierarchyPosition,
    selectedComponentAddress,
    refetch,
  ])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsComponentModalOpen(false)

    if (!lastEditedHierarchyItem) return

    navigate(`/_ecu_/component/${lastEditedHierarchyItem.fileAddress}/${lastEditedHierarchyItem.componentAddress}`)
  }, [navigate, lastEditedHierarchyItem])

  const navigateToLastHierarchyItem = useCallback(() => {
    setIsChildrenModalOpen(false)

    if (!lastHierarchyItem) return

    navigate(`/_ecu_/component/${lastHierarchyItem.fileAddress}/${lastHierarchyItem.componentAddress}`)
  }, [navigate, lastHierarchyItem])

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
        pt={0.5}
      >
        <P
          fontWeight="bold"
          px={1}
        >
          Insert component
        </P>
        <Menu ghost>
          {componentsQueryResult.data.components.map(x => (
            <MenuItem
              ghost
              key={x.component.address}
              onClick={() => setSelectedComponentId(x.component.address)}
              backgroundColor={selectedComponentAddress === x.component.address ? 'darken(background-light, 20)' : null}
            >
              {x.component.payload.name}
              {x.isComponentAcceptingChildren && (
                <Div
                  ml={0.5}
                  xflex="x5"
                  title="Component accepts children"
                >
                  <VscTypeHierarchySub />
                </Div>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Div>
      <Div
        xflex="x4"
        flexShrink={0}
        gap={0.5}
        px={0.5}
        pb={0.5}
        mt={1}
      >
        <Select
          menuOnTop
          width="auto"
          backgroundColor="background"
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
        open={isComponentModalOpen}
        onClose={() => setIsComponentModalOpen(false)}
      >
        <H3>Cannot insert component</H3>
        <P mt={2}>
          You are currently editing
          {' '}
          {hierarchy[0]?.componentName}
        </P>
        <P mt={1}>
          To add a component here, you must edit
          {' '}
          {lastEditedHierarchyItem?.componentName}
          .
        </P>
        <Div
          xflex="x6"
          mt={2}
          gap={0.5}
        >
          <Button onClick={() => setIsComponentModalOpen(false)}>
            Close
          </Button>
          <Button onClick={navigateToLastEditedComponent}>
            Go to
            {' '}
            {lastEditedHierarchyItem?.componentName}
          </Button>
        </Div>
      </Modal>
      <Modal
        open={isChildrenModalOpen}
        onClose={() => setIsChildrenModalOpen(false)}
      >
        <H3>Cannot insert component</H3>
        <P mt={2}>
          {lastHierarchyItem?.componentName}
          {' '}
          is not accepting children.
        </P>
        <Div
          xflex="x6"
          mt={2}
          gap={0.5}
        >
          <Button onClick={() => setIsChildrenModalOpen(false)}>
            Close
          </Button>
          {!!lastHierarchyItem?.componentAddress && (
            <Button onClick={navigateToLastHierarchyItem}>
              Go to
              {' '}
              {lastHierarchyItem?.componentName}
            </Button>
          )}
        </Div>
      </Modal>
    </>
  )
}

export default memo(AddComponentSection)
