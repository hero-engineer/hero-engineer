import { HistoryMutationReturnType } from '../types.js'
import updateGraphHash from '../graph/hash/updateGraphHash.js'

import createCommit from './createCommit.js'

function composeHistoryMutation(mutate: (...args: any[]) => Promise<HistoryMutationReturnType<any>>) {
  return async (...args: any[]) => {
    const { returnValue, description } = await mutate(...args)

    await updateGraphHash()

    await createCommit(description)

    return returnValue
  }
}

export default composeHistoryMutation
