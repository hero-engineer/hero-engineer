// Completly immature, good for now
function areSelectorsEqual(selector1: string, selector2: string) {
  const a = selector1.split('.').filter(Boolean)
  const b = selector2.split('.').filter(Boolean)

  if (a.length !== b.length) return false

  return a.every(item => b.includes(item))
}

export default areSelectorsEqual
