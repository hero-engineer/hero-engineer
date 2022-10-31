import { HistoryMutationReturnType } from '../types'
import updateGraphHash from '../graph/hash/updateGraphHash'

// import createHistoryBackup from './createHistoryBackup'
// import createHistoryEntry from './createHistoryEntry'

function composeHistoryMutation(mutate: (...args: any[]) => Promise<HistoryMutationReturnType<any>>) {
  return async (...args: any[]) => {
    // const backupPath = createHistoryBackup()

    const { returnValue, impactedFileNodes, description } = await mutate(...args)

    await updateGraphHash()

    // createHistoryEntry(impactedFileNodes, description)

    return returnValue
  }
}

export default composeHistoryMutation
