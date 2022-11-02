function countArraysStartEquality(a: any[], b: any[]) {
  let i = 0

  while (typeof a[i] !== 'undefined' && a[i] === b[i]) {
    i++
  }

  return i
}

export default countArraysStartEquality
