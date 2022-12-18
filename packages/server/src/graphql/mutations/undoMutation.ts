import undo from '../../git/undo.js'

async function undoMutation() {
  return undo()
}

export default undoMutation
