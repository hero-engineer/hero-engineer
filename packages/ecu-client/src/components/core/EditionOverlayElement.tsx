import { MouseEvent, memo } from 'react'
import { Div } from 'honorable'

import { HierarchyItemType } from '../../types'

type EditionOverlayElementPropsType = {
  hierarchyItem: HierarchyItemType
  depth: number
  top: number
  left: number
  width: number
  height: number
  helperText: string
  isSelected: boolean
  isEdited: boolean
  onSelect: (event: MouseEvent) => void
}

function EditionOverlayElement({ hierarchyItem, depth, top, left, width, height, helperText, isSelected, isEdited, onSelect }: EditionOverlayElementPropsType) {
  const color = isEdited ? 'is-edited' : isSelected ? 'primary' : null

  return (
    <>
      <Div
        position="absolute"
        top={top - 1}
        left={left - 1}
        width={width + 2}
        height={height + 2}
        zIndex={depth}
        border={color ? `1px solid ${color}` : null}
        _hover={{
          border: `1px solid ${isEdited ? 'is-edited' : 'primary'}`,
          '& + div': {
            display: 'flex',
            '&:hover': {
              display: isSelected ? 'flex' : 'none',
            },
          },
        }}
        onClick={onSelect}
      />
      <Div
        xflex="x4"
        display={isSelected ? 'flex' : 'none'}
        position="absolute"
        top={top - 16 - 1 < 0 ? 0 : top - 16 - 1}
        left={left - 1}
        height={16}
        backgroundColor={color}
        color={isSelected || isEdited ? 'white' : 'primary'}
        fontSize="0.75rem"
        gap={0.25}
        px={0.25 * 2 / 3}
      >
        {hierarchyItem.displayName || hierarchyItem.label}
        <Div
          xflex="x4"
          color="darken(white, 20)"
        >
          {helperText}
        </Div>
      </Div>
    </>
  )
}

export default memo(EditionOverlayElement)
