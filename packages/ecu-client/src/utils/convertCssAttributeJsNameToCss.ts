function convertCssAttributeJsNameToCss(attributeName: string) {
  return attributeName.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export default convertCssAttributeJsNameToCss
