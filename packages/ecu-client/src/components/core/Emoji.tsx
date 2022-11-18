import { Emoji as ExternalEmoji } from 'emoji-picker-react'

import getEmojiUrl from '../../helpers/getEmojiUrl'

type EmojiPropsType = {
  emoji: string
  size?: number
}

function Emoji({ emoji, size }: EmojiPropsType) {
  return (
    <ExternalEmoji
      unified={emoji}
      size={size}
      getEmojiUrl={getEmojiUrl}
    />
  )
}

export default Emoji
