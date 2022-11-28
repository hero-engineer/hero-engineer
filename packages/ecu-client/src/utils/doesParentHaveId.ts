function doesParentHaveId(element: Element | null, id: string): boolean {
  if (!element) {
    return false
  }

  if (element.id === id) {
    return true
  }

  return element.parentElement ? doesParentHaveId(element.parentElement, id) : false
}

export default doesParentHaveId
