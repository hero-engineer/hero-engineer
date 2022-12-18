import readEcuHistory from './readEcuHistory.js'
import writeEcuHistory from './writeEcuHistory.js'

function popEcuHistory() {
  const historyArray = readEcuHistory()
  const historyItem = historyArray.pop()

  writeEcuHistory(historyArray)

  return historyItem
}

export default popEcuHistory
