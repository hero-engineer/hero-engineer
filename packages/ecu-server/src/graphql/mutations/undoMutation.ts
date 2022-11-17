import undo from '../../git/undo.js'

async function undoMutation() {
  console.log('___undoMutation___')

  return undo()
}

export default undoMutation
