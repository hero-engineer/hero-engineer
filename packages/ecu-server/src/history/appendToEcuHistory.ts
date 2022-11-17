import readEcuHistory from './readEcuHistory.js'
import writeEcuHistory from './writeEcuHistory.js'

function appendToEcuHistory(branch: string, message: string) {
  writeEcuHistory([...readEcuHistory(), { branch, message }])
}

export default appendToEcuHistory
