function extractSelectors(selector: string) {
  return selector.split('.')
    .map(s => s.trim())
    .filter(Boolean)
}

export default extractSelectors
