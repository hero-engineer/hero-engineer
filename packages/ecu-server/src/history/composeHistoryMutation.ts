import { HistoryMutationReturnType } from '../types.js'
import updateGraphHash from '../graph/hash/updateGraphHash.js'

import { appPath } from '../configuration.js'

import commit from '../git/commit.js'

import writeEcuHistory from './writeEcuHistory.js'

function composeHistoryMutation<T>(mutate: (...args: any[]) => Promise<HistoryMutationReturnType<T>>) {
  return async (...args: Parameters<typeof mutate>) => {
    const { returnValue, description } = await mutate(...args)

    await updateGraphHash()

    writeEcuHistory([])

    await commit(appPath, description)

    return returnValue
  }
}

export default composeHistoryMutation
