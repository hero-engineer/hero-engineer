function compareCursors(a: number[], b: number[]) {
  const minLength = Math.min(a.length, b.length)

  for (let i = 0; i < minLength; i++) {
    if (a[i] < b[i]) return true
  }

  return false
}

export default compareCursors
