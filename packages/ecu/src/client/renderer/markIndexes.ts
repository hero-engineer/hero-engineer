function markIndexes(root: Element, index = '0') {
  let marked = false

  if (root.hasAttribute('ecu')) {
    root.setAttribute('ecu', index)
    marked = true
  }

  if (root.hasChildNodes()) {
    for (let i = 0; i < root.children.length; i++) {
      const child = root.children[i]
      const nextIndex = marked ? `${index}.${i}` : index

      markIndexes(child, nextIndex)
    }
  }
}

export default markIndexes
