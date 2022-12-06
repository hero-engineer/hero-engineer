import { Ref, forwardRef } from 'react'
import { Emoji as ExternalEmoji } from 'emoji-picker-react'
import { Div, DivProps } from 'honorable'

import getEmojiUrl from '@utils/getEmojiUrl'

type EmojiPropsType = DivProps & {
  emoji: string
  size?: number
}

// An emoji component
function EmojiRef({ emoji, size = 16, ...props }: EmojiPropsType, ref: Ref<any>) {
  if (!emoji) return null

  return (
    <Div
      ref={ref}
      xflex="x5"
      {...props}
    >
      <ExternalEmoji
        unified={emoji}
        size={size}
        getEmojiUrl={getEmojiUrl}
      />
    </Div>
  )
}

export default forwardRef(EmojiRef)
