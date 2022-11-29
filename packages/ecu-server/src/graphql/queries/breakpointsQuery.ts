import readBreakpoints from '../../domain/css/readBreakpoints.js'

function breakpointsQuery() {
  console.log('__breakpointsQuery__')

  return readBreakpoints()
}

export default breakpointsQuery
