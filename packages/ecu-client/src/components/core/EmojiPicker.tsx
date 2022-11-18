import { useState } from 'react'
import data from '@emoji-mart/data'
// @ts-expect-error
import Picker from '@emoji-mart/react'

import { Div, Tooltip } from 'honorable'

import Emoji from './Emoji'

type EmojiPickerPropsType= {
  emoji: string
}

function EmojiPicker({ emoji }: EmojiPickerPropsType) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  return (
    // @ts-ignore
    <Tooltip
      label="Pick an emoji for this file"
      placement="bottom-start"
    >
      <Div
        xflex="x5"
        cursor="pointer"
      >
        <Emoji
          emoji=":white_circle:"
          // @ts-expect-error
          size="1.5rem"
        />
      </Div>
    </Tooltip>
  )
}

export default EmojiPicker
