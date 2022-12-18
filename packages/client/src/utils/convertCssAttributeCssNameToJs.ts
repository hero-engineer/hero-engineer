function convertCssAttributeCssNameToJs(attributeName: string): string {
  return attributeName.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

export default convertCssAttributeCssNameToJs
