import { useCallback, useRef, useState } from 'react'
import ExternalEmojiPicker from 'emoji-picker-react'
import { Div, Tooltip } from 'honorable'

import getEmojiUrl from '../../helpers/getEmojiUrl'

import useOutsideClick from '../../hooks/useOutsideClick'

import Emoji from './Emoji'

type EmojiPickerPropsType= {
  emoji: string
  setEmoji: (emoji: string) => void
}

function EmojiPicker({ emoji, setEmoji }: EmojiPickerPropsType) {
  const emojisRef = useRef<HTMLDivElement>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleEmojiClose = useCallback(() => {
    setIsEmojiPickerOpen(false)
  }, [])

  console.log('emojisRef.current', emojisRef.current)
  useOutsideClick(emojisRef, handleEmojiClose, true)

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
            emoji={emoji || '26aa'}
          />
        </Div>
      </Tooltip>
      {isEmojiPickerOpen && (
        <Div
          ref={emojisRef}
          xflex="x5"
          position="absolute"
          top="calc(100% + 8px)"
          left={0}
        >
          Foo
        </Div>
      )}
    </Div>
  )
}

/*
<ExternalEmojiPicker
            autoFocusSearch
            onEmojiClick={console.log}
            getEmojiUrl={getEmojiUrl}
          />
*/
export default EmojiPicker
