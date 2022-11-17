import redo from '../../git/redo.js'

async function redoMutation() {
  console.log('___redoMutation___')

  return redo()
}

export default redoMutation
