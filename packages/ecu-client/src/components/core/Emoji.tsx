import { Emoji as ExternalEmoji } from 'emoji-picker-react'

import getEmojiUrl from '../../helpers/getEmojiUrl'

type EmojiPropsType = {
  emoji: string
  size?: number
}

// An emoji component
function Emoji({ emoji, size = 16 }: EmojiPropsType) {
  if (!emoji) return null

  return (
    <ExternalEmoji
      unified={emoji}
      size={size}
      getEmojiUrl={getEmojiUrl}
    />
  )
}

export default Emoji
