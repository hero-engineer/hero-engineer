import { useCallback, useState } from 'react'
import { Div, Tooltip, WithOutsideClick } from 'honorable'

import { zIndexes } from '~constants'

import Emoji from './Emoji'
import EmojiPickerBase from './EmojiPickerBase'

type EmojiPickerPropsType= {
  emoji: string
  onEmojiChange: (emoji: string) => void
  size?: number
}

// An emoji picker component for a file
function EmojiPicker({ emoji, onEmojiChange, size = 24 }: EmojiPickerPropsType) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleEmojiClose = useCallback(() => {
    setIsEmojiPickerOpen(false)
  }, [])

  const handleEmojiSelect = useCallback((emojiObject: any) => {
    onEmojiChange(emojiObject.unified)
    handleEmojiClose()
  }, [onEmojiChange, handleEmojiClose])

  return (
    <Div
      xflex="x5"
      position="relative"
    >
      <Tooltip
        label="Pick an emoji for this file"
        placement="bottom-start"
      >
        <Div
          xflex="x5"
          cursor="pointer"
          onClick={() => setIsEmojiPickerOpen(true)}
        >
          <Emoji
            size={size}
            emoji={emoji || '26aa'}
          />
        </Div>
      </Tooltip>
      {isEmojiPickerOpen && (
        <WithOutsideClick
          preventFirstFire
          onOutsideClick={handleEmojiClose}
        >
          <Div
            xflex="x5"
            position="absolute"
            top="calc(100% + 8px)"
            left={0}
            zIndex={zIndexes.emojiPicker}
          >
            <EmojiPickerBase onChange={handleEmojiSelect} />
          </Div>
        </WithOutsideClick>
      )}
    </Div>
  )
}

export default EmojiPicker
