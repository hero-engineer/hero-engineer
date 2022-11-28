import { useCallback } from 'react'
import ExternalEmojiPicker, { EmojiClickData } from 'emoji-picker-react'

import getEmojiUrl from '../../utils/getEmojiUrl'

type EmojiPickerBasePropsType= {
  onChange: (unified: string, raw: string) => void
}

// An emoji picker component
function EmojiPickerBase({ onChange }: EmojiPickerBasePropsType) {

  const handleEmojiSelect = useCallback((emojiObject: EmojiClickData) => {
    onChange(emojiObject.unified, emojiObject.emoji)
  }, [onChange])

  return (
    <ExternalEmojiPicker
      autoFocusSearch
      onEmojiClick={handleEmojiSelect}
      getEmojiUrl={getEmojiUrl}
    />
  )
}

export default EmojiPickerBase
