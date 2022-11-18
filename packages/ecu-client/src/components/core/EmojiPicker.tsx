import { useState } from 'react'
import ExternalEmojiPicker, {
  Emoji,
  EmojiStyle,
} from 'emoji-picker-react'
import { Div, Tooltip } from 'honorable'

type EmojiPickerPropsType= {
  emoji: string
  setEmoji: (emoji: string) => void
}

function EmojiPicker({ emoji, setEmoji }: EmojiPickerPropsType) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  console.log('emoji', emoji)

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
            size={32}
            unified={emoji || '26aa'}
            emojiStyle={EmojiStyle.APPLE}
          />
        </Div>
      </Tooltip>
      {isEmojiPickerOpen && (
        <Div
          xflex="x5"
          position="absolute"
          top="100%"
          left={0}
        >
          <ExternalEmojiPicker
            autoFocusSearch
            onEmojiClick={console.log}
            emojiStyle={EmojiStyle.APPLE}
          />
        </Div>
      )}
    </Div>
  )
}

export default EmojiPicker
