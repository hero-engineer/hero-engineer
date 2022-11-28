// Maps to the static server emojis url
function getEmojiUrl(emoji: string) {
  return `http://localhost:4001/emojis/${emoji}.png`
}

export default getEmojiUrl
