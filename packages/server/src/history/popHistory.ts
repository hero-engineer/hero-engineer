import readHistory from './readHistory.js'
import writeHistory from './writeHistory.js'

function popHistory() {
  const historyArray = readHistory()
  const historyItem = historyArray.pop()

  writeHistory(historyArray)

  return historyItem
}

export default popHistory
