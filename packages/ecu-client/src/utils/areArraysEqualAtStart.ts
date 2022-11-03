function areArraysEqualAtStart(a: any[], b: any[]) {
  return a.every((x, i) => x === b[i])
}

export default areArraysEqualAtStart
