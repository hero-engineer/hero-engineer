function extractClassNamesFromSelector(selector: string) {
  return selector.split('.')
    .map(s => s.trim())
    .filter(Boolean)
}

export default extractClassNamesFromSelector
