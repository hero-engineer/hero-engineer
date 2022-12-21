import { memo, useCallback, useState } from 'react'
import { Div, Menu, MenuItem, WithOutsideClick } from 'honorable'
import { MdClose, MdMoreVert } from 'react-icons/md'

import { zIndexes } from '~constants'

type CssSelectorChipPropsType = {
  selector: string
  isSelected: boolean
  onSelect: () => void
  onDiscard: () => void
  onDelete: () => void
}

function CssSelectorChip({ selector, isSelected, onSelect, onDiscard, onDelete }: CssSelectorChipPropsType) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const renderMenu = useCallback(() => (
    <>
      <Div
        position="fixed"
        top={0}
        bottom={0}
        left={0}
        right={0}
        cursor="auto"
        zIndex={zIndexes.cssSelectorChipMenu - 1}
      />
      <WithOutsideClick
        preventFirstFire
        onOutsideClick={handleMenuClose}
      >
        <Menu
          slim
          position="absolute"
          top="calc(100% + 4px)"
          right={0}
          fontSize="0.75rem"
          maxHeight={256}
          overflowY="auto"
          zIndex={zIndexes.cssSelectorChipMenu}
        >
          <MenuItem
            slim
            onClick={onDelete}
          >
            Delete
          </MenuItem>
        </Menu>
      </WithOutsideClick>
    </>
  ), [handleMenuClose, onDelete])

  return (
    <Div
      xflex="x4"
      position="relative"
      flexShrink={0}
      backgroundColor={isSelected ? 'primary' : 'background-light-light'}
      color={isSelected ? 'white' : 'text'}
      borderRadius="medium"
      minWidth={0} // For ellipsis to work
      maxWidth="100%"
      cursor="pointer"
      userSelect="none"
      gap={0.25 / 2}
      p={0.25}
    >
      <Div
        ellipsis
        onClick={onSelect}
      >
        {selector}
      </Div>
      <Div
        xflex="x5"
        fontSize="0.75em"
        onClick={() => setIsMenuOpen(true)}
      >
        <MdMoreVert />
      </Div>
      <Div
        xflex="x5"
        fontSize="0.75em"
        onClick={onDiscard}
      >
        <MdClose />
      </Div>
      {isMenuOpen && renderMenu()}
    </Div>
  )
}

export default memo(CssSelectorChip)
