import '../../../css/HierarchySection.css'

import { MouseEvent, memo, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { A, Div, Input, P, TreeView, WithOutsideClick } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'
import { IoSquareSharp } from 'react-icons/io5'
import { VscEdit } from 'react-icons/vsc'
import { SlTrash } from 'react-icons/sl'

import { HierarchyItemType } from '~types'

import { refetchKeys } from '~constants'

import { DeleteComponentMutation, DeleteComponentMutationDataType, UpdateHierarchyDisplayNameMutation, UpdateHierarchyDisplayNameMutationDataType } from '~queries'

import HierarchyContext from '~contexts/HierarchyContext'
import EditionContext from '~contexts/EditionContext'
import ContextualInformationContext from '~contexts/ContextualInformationContext'

import useMutation from '~hooks/useMutation'
import useRefetch from '~hooks/useRefetch'
import useIsComponentRefreshingMutation from '~hooks/useIsComponentRefreshingMutation'
import useHierarchySelection from '~hooks/useHierarchySelection'

import findHierarchyIdAndComponentDelta from '~utils/findHierarchyIdAndComponentDelta'

import Emoji from '../emoji/Emoji'

// The hierarchy section
// Displayed in the left panel
function PanelHierarchy() {
  const { componentAddress = '' } = useParams()
  const { totalHierarchy, hierarchy } = useContext(HierarchyContext)
  const { setContextualInformationState } = useContext(ContextualInformationContext)
  const { hierarchyId, componentDelta, setHierarchyId, setComponentDelta } = useContext(EditionContext)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [isFetching, setIsFetching] = useState(false)

  const handleHierarchySelect = useHierarchySelection()

  const [, deleteComponent] = useIsComponentRefreshingMutation(useMutation<DeleteComponentMutationDataType>(DeleteComponentMutation))

  const refetch = useRefetch()

  const handleSelect = useCallback((event: MouseEvent, hierarchyItem: HierarchyItemType) => {
    const found = findHierarchyIdAndComponentDelta(totalHierarchy, hierarchyItem)

    if (!found) return

    handleHierarchySelect(event, hierarchyItem, found.hierarchyId, found.componentDelta)
  }, [totalHierarchy, handleHierarchySelect])

  const handleDeleteComponent = useCallback(async () => {
    await deleteComponent({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyId,
      componentDelta,
    })

    setHierarchyId('')
    setComponentDelta(0)

    setContextualInformationState(x => ({ ...x, element: null }))

    refetch(refetchKeys.hierarchy)
  }, [
    hierarchyId,
    componentDelta,
    componentAddress,
    deleteComponent,
    setHierarchyId,
    setComponentDelta,
    setContextualInformationState,
    refetch,
  ])

  const renderHierarchyItem = useCallback((hierarchyItem: HierarchyItemType | null) => {
    if (!(hierarchyItem && hierarchyItem.label)) return null

    return (
      <TreeView
        key={hierarchyItem.label} // Do not use id here or it will refresh with hierarchy change
        width="100%"
        defaultExpanded
        label={(
          <HierarchyLabel
            hierarchyItem={hierarchyItem}
            collapsed={collapsed[hierarchyItem.id]}
            isSelected={hierarchy[hierarchy.length - 1]?.id === hierarchyItem.id}
            isFetching={isFetching}
            setIsFetching={setIsFetching}
            onExpand={() => setCollapsed(x => ({ ...x, [hierarchyItem.id]: !collapsed[hierarchyItem.id] }))}
            onSelect={event => handleSelect(event, hierarchyItem)}
            onDelete={handleDeleteComponent}
          />
        )}
        expanded={!collapsed[hierarchyItem.id]}
      >
        {hierarchyItem.children.map(renderHierarchyItem)}
      </TreeView>
    )
  }, [collapsed, isFetching, hierarchy, handleSelect, handleDeleteComponent])

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256}
      overflowY="auto"
    >
      <P
        fontWeight="bold"
        userSelect="none"
        px={1}
        mt={0.5}
        mb={0.5}
      >
        Hierarchy
      </P>
      <Div
        flexGrow
        overflowY="auto"
        pb={2}
        pl={1}
      >
        {renderHierarchyItem(totalHierarchy)}
      </Div>
    </Div>
  )
}

type GetComponentDeltaAndHierarchyIdReturnType = {
  componentDelta: number
  hierarchyId: string
}

function getComponentDeltaAndHierarchyId(hierarchyItem: HierarchyItemType, componentDelta = 0): GetComponentDeltaAndHierarchyIdReturnType | null {
  if (hierarchyItem.hierarchyId) {
    return {
      componentDelta,
      hierarchyId: hierarchyItem.hierarchyId,
    }
  }

  const nextComponentDelta = componentDelta - 1

  for (const child of hierarchyItem.children) {
    const retval = getComponentDeltaAndHierarchyId(child, nextComponentDelta)

    if (retval !== null) return retval
  }

  return null
}

type HierarchyLabelPropsType = {
  hierarchyItem: HierarchyItemType
  collapsed: boolean
  isSelected: boolean
  isFetching: boolean
  setIsFetching: (isFetching: boolean) => void
  onExpand: () => void
  onSelect: (event: MouseEvent) => void
  onDelete: () => void
}

function HierarchyLabel({ hierarchyItem, collapsed, isSelected, isFetching, setIsFetching, onExpand, onSelect, onDelete }: HierarchyLabelPropsType) {
  const { componentAddress = '' } = useParams()

  const [displayName, setDisplayName] = useState(hierarchyItem.displayName || hierarchyItem.label || '')
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
  const [isLoadingDisplayName, setIsLoadingDisplayName] = useState(false)

  const [, updateHierarchyDisplayName] = useMutation<UpdateHierarchyDisplayNameMutationDataType>(UpdateHierarchyDisplayNameMutation)

  const refetch = useRefetch()

  const handleEditDisplayName = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    setIsEditingDisplayName(true)
  }, [])

  const handleUpdateDisplayName = useCallback(async () => {
    if (isFetching || hierarchyItem.isRoot || hierarchyItem.onComponentAddress !== componentAddress) return

    setIsEditingDisplayName(false)

    const { componentDelta, hierarchyId } = getComponentDeltaAndHierarchyId(hierarchyItem) || {}

    if (!hierarchyId) return

    let value = displayName.trim()

    setDisplayName(value)

    if (value === hierarchyItem.label) value = ''

    setIsLoadingDisplayName(true)
    setIsFetching(true)

    await updateHierarchyDisplayName({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyId,
      componentDelta,
      value,
    })

    setIsFetching(false)

    refetch(refetchKeys.hierarchy)
  }, [
    isFetching,
    hierarchyItem,
    updateHierarchyDisplayName,
    componentAddress,
    displayName,
    setIsFetching,
    refetch,
  ])

  useEffect(() => {
    setIsLoadingDisplayName(false)
  }, [hierarchyItem])

  return (
    <Div
      xflex="x4"
      cursor="pointer"
      userSelect="none"
      py={0.25}
      className="ecu-hierarchy-label"
    >
      {!!hierarchyItem.children.length && (
        <Div
          xflex="x5"
          flexShrink={0}
          onClick={onExpand}
          pr={0.25}
        >
          <BiCaretRight
            size={12}
            style={{
              transform: `rotate(${collapsed ? 0 : 90}deg)`,
            }}
          />
        </Div>
      )}
      {!hierarchyItem.children.length && (
        <Div
          xflex="x5"
          flexShrink={0}
          mx={0.225}
          pr={0.25}
        >
          <IoSquareSharp size={5} />
        </Div>
      )}
      <Div
        xflex="x4"
        gap={0.25}
        onClick={onSelect}
        minWidth={0}
      >
        <Emoji emoji={hierarchyItem.fileEmoji} />
        <Div
          ellipsis
          flexShrink={1}
          color={isSelected && !isEditingDisplayName ? 'primary' : 'inherit'}
        >
          {isEditingDisplayName ? (
            <WithOutsideClick onOutsideClick={handleUpdateDisplayName}>
              <Input
                bare
                autoFocus
                autoSelect
                value={displayName}
                onEnter={handleUpdateDisplayName}
                onChange={event => setDisplayName(event.target.value)}
                onClick={(event: any) => event.stopPropagation()}
              />
            </WithOutsideClick>
          ) : isLoadingDisplayName
            ? displayName || hierarchyItem.label
            : hierarchyItem.displayName || hierarchyItem.label}
        </Div>
        {!isFetching && !isEditingDisplayName && !hierarchyItem.isRoot && hierarchyItem.onComponentAddress === componentAddress && (
          <A
            onClick={handleEditDisplayName}
            flexShrink={0}
            fontSize="0.75rem"
            className="ecu-hierarchy-label-edit"
            pl={0.25}
            pr={isSelected ? 0.25 : 0.5}
          >
            <VscEdit />
          </A>
        )}
        {isSelected && !isFetching && !isEditingDisplayName && !hierarchyItem.isRoot && hierarchyItem.onComponentAddress === componentAddress && (
          <A
            onClick={onDelete}
            flexShrink={0}
            color="danger"
            fontSize="0.75rem"
            className="ecu-hierarchy-label-edit"
            pl={0.25}
            pr={0.5}
          >
            <SlTrash />
          </A>
        )}
      </Div>
    </Div>
  )
}

export default memo(PanelHierarchy)
