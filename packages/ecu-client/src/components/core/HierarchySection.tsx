import '../../css/HierarchySection.css'

import { MouseEvent, memo, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { A, Div, Input, P, TreeView, WithOutsideClick } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'
import { IoSquareSharp } from 'react-icons/io5'
import { VscEdit } from 'react-icons/vsc'

import { HierarchyItemType } from '../../types'
import { refetchKeys } from '../../constants'

import { UpdateHierarchyDisplayNameMutation, UpdateHierarchyDisplayNameMutationDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'

import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'

import xor from '../../utils/xor'

import Emoji from './Emoji'

// The hierarchy section
// Displayed in the left panel
function HierarchySection() {
  const { totalHierarchy } = useContext(HierarchyContext)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [isFetching, setIsFetching] = useState(false)

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
            isFetching={isFetching}
            setIsFetching={setIsFetching}
          />
        )}
        onExpand={expanded => setCollapsed(x => ({ ...x, [hierarchyItem.id]: !expanded }))}
      >
        {hierarchyItem.children.map(renderHierarchyItem)}
      </TreeView>
    )
  }, [collapsed, isFetching])

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256 + 64}
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
  isFetching: boolean
  setIsFetching: (isFetching: boolean) => void
}

function HierarchyLabel({ hierarchyItem, collapsed, isFetching, setIsFetching }: HierarchyLabelPropsType) {
  const { componentAddress = '' } = useParams()

  const [displayName, setDisplayName] = useState(hierarchyItem.displayName || hierarchyItem.label || '')
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
  const [isLoadingDisplayName, setIsLoadingDisplayName] = useState(false)
  const [selected, setSelected] = useState(false)

  const [, updateHierarchyDisplayName] = useMutation<UpdateHierarchyDisplayNameMutationDataType>(UpdateHierarchyDisplayNameMutation)

  const refetch = useRefetch()

  const handleEditDisplayName = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    setIsEditingDisplayName(true)
  }, [])

  const handleUpdateDisplayName = useCallback(async () => {
    if (isFetching || hierarchyItem.isRoot || hierarchyItem.onComponentAddress !== componentAddress) return

    setIsEditingDisplayName(false)
    setSelected(false)

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

  const handleInputRef = useCallback((input: HTMLInputElement | null) => {
    if (input && !selected) {
      input.select()

      setSelected(true)
    }
  }, [selected])

  useEffect(() => {
    setIsLoadingDisplayName(false)
  }, [hierarchyItem])

  return (
    <Div
      xflex="x4"
      cursor="pointer"
      userSelect="none"
      gap={0.25}
      py={0.25}
      className="ecu-hierarchy-label"
    >
      {!!hierarchyItem.children.length && (
        <BiCaretRight
          size={12}
          style={{
            transform: `rotate(${collapsed ? 0 : 90}deg)`,
          }}
        />
      )}
      {!hierarchyItem.children.length && (
        <Div
          xflex="x5"
          mx={0.225}
        >
          <IoSquareSharp size={5} />
        </Div>
      )}
      <Emoji emoji={hierarchyItem.fileEmoji} />
      {isEditingDisplayName ? (
        <WithOutsideClick onOutsideClick={handleUpdateDisplayName}>
          <Input
            inputProps={{ ref: handleInputRef }}
            bare
            autoFocus
            value={displayName}
            onEnter={handleUpdateDisplayName}
            onChange={event => setDisplayName(event.target.value)}
            onClick={(event: any) => event.stopPropagation()}
          />
        </WithOutsideClick>
      ) : isLoadingDisplayName
        ? displayName || hierarchyItem.label
        : hierarchyItem.displayName || hierarchyItem.label}
      {!hierarchyItem.isRoot && !isEditingDisplayName && !(isLoadingDisplayName && !displayName) && ((isLoadingDisplayName && !!displayName) || !!hierarchyItem.displayName) && (
        <Div
          color="text-light"
          fontSize={10}
        >
          {hierarchyItem.label}
        </Div>
      )}
      {!isFetching && !isEditingDisplayName && !hierarchyItem.isRoot && hierarchyItem.onComponentAddress === componentAddress && (
        <A
          onClick={handleEditDisplayName}
          fontSize="0.75rem"
          className="ecu-hierarchy-label-edit"
          px={0.25}
        >
          <VscEdit />
        </A>
      )}
    </Div>
  )
}

export default memo(HierarchySection)
