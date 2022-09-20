function wrapper(domElement: Element) {
  const element = document.createElement('div')

  element.setAttribute('ecu', '-1')
  element.appendChild(domElement)

  return element
}

export default wrapper
