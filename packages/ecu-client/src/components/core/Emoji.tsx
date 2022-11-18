import { HTMLProps } from 'react'

type EmojiPropsType = HTMLProps<HTMLSpanElement> & {
  emoji: string
}

function Emoji({ emoji, ...props }: EmojiPropsType) {
  return (
    // @ts-expect-error
    <em-emoji
      shortcodes={emoji}
      {...props}
    />
  )
}

export default Emoji
