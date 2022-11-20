import { useCallback, useState } from 'react'
import ExternalEmojiPicker from 'emoji-picker-react'
import { Div, Tooltip, WithOutsideClick } from 'honorable'

import getEmojiUrl from '../../helpers/getEmojiUrl'

import Emoji from './Emoji'

type EmojiPickerPropsType= {
  emoji: string
  setEmoji: (emoji: string) => void
  size?: number
}

// An emoji picker component for a file
function EmojiPicker({ emoji, setEmoji, size = 24 }: EmojiPickerPropsType) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleEmojiClose = useCallback(() => {
    setIsEmojiPickerOpen(false)
  }, [])

  const handleEmojiSelect = useCallback((emojiObject: any) => {
    setEmoji(emojiObject.unified)
    handleEmojiClose()
  }, [setEmoji, handleEmojiClose])

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
          >
            <ExternalEmojiPicker
              autoFocusSearch
              onEmojiClick={handleEmojiSelect}
              getEmojiUrl={getEmojiUrl}
            />
          </Div>
        </WithOutsideClick>
      )}
    </Div>
  )
}

export default EmojiPicker
