function applyComponentDelta<T>(array: T[], componentDelta: number) {
  return array[Math.max(0, array.length - 1 + componentDelta)]
}

export default applyComponentDelta
