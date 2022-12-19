import readHeroEngineerHistory from './readHeroEngineerHistory.js'
import writeHeroEngineerHistory from './writeHeroEngineerHistory.js'

function appendToHeroEngineerHistory(branch: string, message: string) {
  writeHeroEngineerHistory([...readHeroEngineerHistory(), { branch, message }])
}

export default appendToHeroEngineerHistory
