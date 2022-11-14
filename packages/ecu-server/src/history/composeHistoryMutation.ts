import { HistoryMutationReturnType } from '../types'
import updateGraphHash from '../graph/hash/updateGraphHash'

import createCommit from './createCommit'

function composeHistoryMutation(mutate: (...args: any[]) => Promise<HistoryMutationReturnType<any>>) {
  return async (...args: any[]) => {
    const { returnValue, description } = await mutate(...args)

    await updateGraphHash()

    await createCommit(description)

    return returnValue
  }
}

export default composeHistoryMutation
