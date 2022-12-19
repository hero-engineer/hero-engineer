import { HistoryMutationReturnType } from '../types.js'

import { appPath } from '../configuration.js'

import commit from '../git/commit.js'

import writeHistory from './writeHistory.js'

function composeHistoryMutation<T>(mutate: (...args: any[]) => Promise<HistoryMutationReturnType<T>>) {
  return async (...args: Parameters<typeof mutate>) => {
    const { returnValue, description } = await mutate(...args)

    writeHistory([])

    await commit(appPath, description)

    return returnValue
  }
}

export default composeHistoryMutation
