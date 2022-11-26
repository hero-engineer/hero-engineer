function removeSelectorPrefix(selector: string): string {
  return selector.startsWith('.') ? selector.slice(1) : selector
}

export default removeSelectorPrefix
