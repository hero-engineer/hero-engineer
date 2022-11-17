import readEcuHistory from '../../history/readEcuHistory.js'

function canRedoQuery() {
  console.log('__canRedoQuery__')

  return readEcuHistory().length > 0
}

export default canRedoQuery
