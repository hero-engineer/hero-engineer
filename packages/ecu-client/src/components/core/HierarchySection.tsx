import { memo, useCallback, useContext, useState } from 'react'
import { Div, P, TreeView } from 'honorable'
import { BiCaretRight } from 'react-icons/bi'
import { IoSquareSharp } from 'react-icons/io5'

import HierarchyContext from '../../contexts/HierarchyContext'
import { HierarchyItemType } from '../../types'

import Emoji from './Emoji'

// The hierarchy section
// Displayed in the left panel
function HierarchySection() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const { totalHierarchy } = useContext(HierarchyContext)

  const renderHierarchyItemLabel = useCallback((hierarchyItem: HierarchyItemType) => (
    <Div
      xflex="x4"
      cursor="pointer"
      userSelect="none"
      gap={0.25}
      py={0.25}
    >
      {!!hierarchyItem.children.length && (
        <BiCaretRight
          size={12}
          style={{
            transform: `rotate(${collapsed[hierarchyItem.id] ? 0 : 90}deg)`,
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
      {hierarchyItem.label}
    </Div>
  ), [collapsed])

  const renderHierarchyItem = useCallback((hierarchyItem: HierarchyItemType | null) => {
    if (!(hierarchyItem && hierarchyItem.label)) return null

    return (
      <TreeView
        key={hierarchyItem.id}
        defaultExpanded
        label={renderHierarchyItemLabel(hierarchyItem)}
        onExpand={expanded => setCollapsed(x => ({ ...x, [hierarchyItem.id]: !expanded }))}
      >
        {hierarchyItem.children.map(renderHierarchyItem)}
      </TreeView>
    )
  }, [renderHierarchyItemLabel])

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

export default memo(HierarchySection)
