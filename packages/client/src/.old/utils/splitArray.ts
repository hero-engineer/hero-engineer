function splitArray(array: any[], index: number) {
  return [array.slice(0, index + 1), array.slice(index + 1)]
}

export default splitArray
