import { useCallback, useContext, useMemo, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { Accordion, Button, Div, H3, Menu, MenuItem, Modal, P, Select } from 'honorable'
import { TbRowInsertBottom } from 'react-icons/tb'
import { VscTypeHierarchySub } from 'react-icons/vsc'

import { ecuAtomPrefix, ecuAtoms, ecuSpecialPrefix, ecuSpecials, hierarchyPositions, refetchKeys } from '../../constants'
import { HierarchyPosition } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'

import useMutation from '../../hooks/useMutation'
import useQuery from '../../hooks/useQuery'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'
import useIsComponentRefreshingMutation from '../../hooks/useIsComponentRefreshingMutation'

import { AddComponentMutation, AddComponentMutationDataType, ComponentsQuery, ComponentsQueryDataType } from '../../queries'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'
import getLastEditedHierarchyItem from '../../helpers/getLastEditedHierarchyItem'

import capitalize from '../../utils/capitalize'
import usePersistedState from '../../hooks/usePersistedState'

// Displayed in the left panel
// Section to insert a component in the hierarchy
function AddComponentSection() {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta } = useEditionSearchParams()
  const { hierarchy } = useContext(HierarchyContext)

  const [isAtomsAccordionExpanded, setIsAtomsAccordionExpanded] = usePersistedState('add-component-section-is-atoms-accordion-expanded', true)
  const [isComponentsAccordionExpanded, setIsComponentsAccordionExpanded] = usePersistedState('add-component-section-is-components-accordion-expanded', true)
  const [isSpecialAccordionExpanded, setIsSpecialAccordionExpanded] = usePersistedState('add-component-section-is-special-accordion-expanded', true)

  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>(hierarchyPositions[0])
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false)
  const [isParentModalOpen, setIsParentModalOpen] = useState(false)
  const [selectedComponentUrlPart, setSelectedComponentFileUrlPart] = useState('')
  const [selectedComponentName, setSelectedComponentName] = useState('')
  const [selectedComponentAddress, setSelectedComponentId] = useState('')
  const [isSelectedComponentAcceptingChildren, setIsSelectedComponentAcceptingChildren] = useState(false)

  const isOnComponentRoot = useMemo(() => hierarchy[hierarchy.length - 1]?.isRoot ?? true, [hierarchy])
  const lastEditedHierarchyItem = useMemo(() => getLastEditedHierarchyItem(hierarchy), [hierarchy])

  const navigate = useNavigate()

  const [componentsQueryResult, refetchComponentsQuery] = useQuery<ComponentsQueryDataType>({
    query: ComponentsQuery,
  })
  const [{ fetching }, addComponent] = useIsComponentRefreshingMutation(useMutation<AddComponentMutationDataType>(AddComponentMutation))

  const refetch = useRefetch({
    key: refetchKeys.components,
    refetch: refetchComponentsQuery,
    skip: !componentAddress,
  })

  const handleComponentSelect = useCallback((selectedComponentAddress: string, selectedComponentName: string, selectedComponentUrlPart: string, isSelectedComponentAcceptingChildren: boolean) => {
    setSelectedComponentId(selectedComponentAddress)
    setSelectedComponentName(selectedComponentName)
    setIsSelectedComponentAcceptingChildren(isSelectedComponentAcceptingChildren)
    setSelectedComponentFileUrlPart(selectedComponentUrlPart)
  }, [])

  const handleAddComponentClick = useCallback(async () => {
    if (isOnComponentRoot) return

    if (!isSelectedComponentAcceptingChildren && hierarchyPosition === 'parent') {
      setIsParentModalOpen(true)

      return
    }

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
    isOnComponentRoot,
    isSelectedComponentAcceptingChildren,
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

  const navigateToSelectedComponent = useCallback(() => {
    setIsParentModalOpen(false)

    if (!selectedComponentUrlPart) return

    navigate(`/_ecu_/component/${selectedComponentUrlPart}`)
  }, [navigate, selectedComponentUrlPart])

  if (componentsQueryResult.error) {
    return null
  }
  if (!componentsQueryResult.data?.components) {
    return null
  }
  if (!componentAddress) {
    return null
  }

  const isComponentAcceptingChildrenNode = (
    <Div
      ml={0.5}
      xflex="x5"
      title="Component accepts children"
    >
      <VscTypeHierarchySub />
    </Div>
  )

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256}
    >
      <Div
        xflex="y2s"
        flexGrow
        pt={0.5}
      >
        <P
          fontWeight="bold"
          userSelect="none"
          px={1}
          mb={0.5}
        >
          Insert component
        </P>
        <Accordion
          ghost
          noChildrenPadding
          title="Atoms"
          expanded={isAtomsAccordionExpanded}
          onExpand={setIsAtomsAccordionExpanded}
        >
          <Menu
            ghost
            width="100%"
          >
            {ecuAtoms.map(ecuAtom => (
              <MenuItem
                ghost
                key={ecuAtom.name}
                onClick={() => handleComponentSelect(ecuAtomPrefix + ecuAtom.name, ecuAtom.name, '', ecuAtom.isComponentAcceptingChildren)}
                backgroundColor={selectedComponentAddress === ecuAtomPrefix + ecuAtom.name ? 'darken(background-light, 6)' : null}
              >
                <Div ellipsis>
                  {ecuAtom.name}
                </Div>
                {ecuAtom.isComponentAcceptingChildren && isComponentAcceptingChildrenNode}
              </MenuItem>
            ))}
          </Menu>
        </Accordion>
        <Accordion
          ghost
          noChildrenPadding
          title="Components"
          expanded={isComponentsAccordionExpanded}
          onExpand={setIsComponentsAccordionExpanded}
        >
          <Menu
            ghost
            width="100%"
          >
            {componentsQueryResult.data.components
            .filter(x => x.component.address !== componentAddress)
            .map(x => (
              <MenuItem
                ghost
                key={x.component.address}
                onClick={() => handleComponentSelect(x.component.address, x.component.payload.name, `${x.file.address}/${x.component.address}`, x.isComponentAcceptingChildren)}
                backgroundColor={selectedComponentAddress === x.component.address ? 'darken(background-light, 6)' : null}
              >
                <Div ellipsis>
                  {x.component.payload.name}
                </Div>
                {x.isComponentAcceptingChildren && isComponentAcceptingChildrenNode}
              </MenuItem>
            ))}
          </Menu>
        </Accordion>
        <Accordion
          ghost
          noChildrenPadding
          title="Special"
          expanded={isSpecialAccordionExpanded}
          onExpand={setIsSpecialAccordionExpanded}
        >
          <Menu
            ghost
            width="100%"
          >
            {ecuSpecials.map(ecuSpecial => (
              <MenuItem
                ghost
                key={ecuSpecial.name}
                onClick={() => handleComponentSelect(ecuSpecialPrefix + ecuSpecial.name, ecuSpecial.name, '', ecuSpecial.isComponentAcceptingChildren)}
                backgroundColor={selectedComponentAddress === ecuSpecialPrefix + ecuSpecial.name ? 'darken(background-light, 6)' : null}
              >
                <Div ellipsis>
                  {ecuSpecial.name}
                </Div>
                {ecuSpecial.isComponentAcceptingChildren && isComponentAcceptingChildrenNode}
              </MenuItem>
            ))}
          </Menu>
        </Accordion>
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
          slim
          menuOnTop
          flexGrow
          backgroundColor="background"
          value={hierarchyPosition}
          onChange={event => setHierarchyPosition(event.target.value)}
        >
          {hierarchyPositions.map(hierarchyPosition => (
            <MenuItem
              slim
              key={hierarchyPosition}
              value={hierarchyPosition}
            >
              {capitalize(hierarchyPosition)}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={handleAddComponentClick}
          disabled={!(selectedComponentAddress && hierarchyIds.length) || isOnComponentRoot}
          loading={fetching}
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
          <Button
            secondary
            onClick={() => setIsComponentModalOpen(false)}
          >
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
        open={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
      >
        <H3>Cannot insert component</H3>
        <P mt={2}>
          {selectedComponentName}
          {' '}
          is not accepting children.
        </P>
        <Div
          xflex="x6"
          mt={2}
          gap={0.5}
        >
          <Button
            secondary
            onClick={() => setIsParentModalOpen(false)}
          >
            Close
          </Button>
          {!selectedComponentAddress.startsWith(ecuAtomPrefix) && !selectedComponentAddress.startsWith(ecuSpecialPrefix) && (
            <Button onClick={navigateToSelectedComponent}>
              Go to
              {' '}
              {selectedComponentName}
            </Button>
          )}
        </Div>
      </Modal>
    </Div>
  )
}

export default AddComponentSection
