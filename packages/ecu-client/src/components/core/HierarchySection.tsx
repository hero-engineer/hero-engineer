import '../../css/HierarchySection.css'

import { MouseEvent, memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
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

import useEditionSearchParams from '../../hooks/useEditionSearchParams'

import Emoji from './Emoji'

// The hierarchy section
// Displayed in the left panel
function HierarchySection() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const { totalHierarchy } = useContext(HierarchyContext)

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
          />
        )}
        onExpand={expanded => setCollapsed(x => ({ ...x, [hierarchyItem.id]: !expanded }))}
      >
        {hierarchyItem.children.map(renderHierarchyItem)}
      </TreeView>
    )
  }, [collapsed])

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256 + 64}
      px={1}
    >
      <P
        fontWeight="bold"
        userSelect="none"
        mt={0.5}
        mb={0.5}
      >
        Hierarchy
      </P>
      {renderHierarchyItem(totalHierarchy)}
    </Div>
  )
}

type HierarchyLabelPropsType = {
  hierarchyItem: HierarchyItemType
  collapsed: boolean
}

function HierarchyLabel({ hierarchyItem, collapsed }: HierarchyLabelPropsType) {
  const { componentAddress = '' } = useParams()
  const { componentDelta } = useEditionSearchParams()

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
    setIsLoadingDisplayName(true)
    setIsEditingDisplayName(false)
    setSelected(false)

    await updateHierarchyDisplayName({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyItem.hierarchyId,
      componentDelta,
      value: displayName,
    })

    refetch(refetchKeys.hierarchy)
  }, [
    updateHierarchyDisplayName,
    componentAddress,
    hierarchyItem.hierarchyId,
    componentDelta,
    displayName,
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
        ? displayName
        : hierarchyItem.displayName || hierarchyItem.label || '?'}
      {!isEditingDisplayName && (
        <A
          onClick={handleEditDisplayName}
          fontSize={12}
          className="ecu-hierarchy-label-edit"
        >
          <VscEdit />
        </A>
      )}
    </Div>
  )
}

export default memo(HierarchySection)
