import { MutateType } from '../types'

function createDeleteComponentMutate(): MutateType {
  return (x: any, previousX: any) => {
    (previousX || x).remove()
  }
}

export default createDeleteComponentMutate
