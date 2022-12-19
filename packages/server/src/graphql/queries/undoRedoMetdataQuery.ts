import getLastGitMessage from '../../git/getLastGitMessage.js'

import readHistory from '../../history/readHistory.js'

function canRedoQuery() {
  const ecuHistory = readHistory()

  return {
    undoMessage: getLastGitMessage(),
    redoMessage: ecuHistory[ecuHistory.length - 1]?.message ?? null,
  }
}

export default canRedoQuery
