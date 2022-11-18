import undo from '../../git/undo.js'

async function undoMutation() {
  console.log('__undoMutation__')

  return undo()
}

export default undoMutation
