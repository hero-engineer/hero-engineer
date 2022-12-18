import getLastGitMessage from '../../git/getLastGitMessage.js'

import readEcuHistory from '../../history/readEcuHistory.js'

function canRedoQuery() {
  const ecuHistory = readEcuHistory()

  return {
    undoMessage: getLastGitMessage(),
    redoMessage: ecuHistory[ecuHistory.length - 1]?.message ?? null,
  }
}

export default canRedoQuery
