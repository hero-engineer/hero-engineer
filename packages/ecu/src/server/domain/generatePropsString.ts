function generatePropsString(props: Record<string, any>) {
  return Object.keys(props).map(key => `${key}={${props[key]}}`).join(' ')
}

export default generatePropsString
