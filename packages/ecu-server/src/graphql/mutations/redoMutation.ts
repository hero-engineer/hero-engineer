import redo from '../../git/redo.js'

async function redoMutation() {
  console.log('__redoMutation__')

  return redo()
}

export default redoMutation
