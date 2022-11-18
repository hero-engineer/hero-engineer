function getEmojiUrl(emoji: string) {
  return `http://localhost:4001/emojis/${emoji}.png`
}

export default getEmojiUrl
