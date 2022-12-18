function omitArray<T>(array: T[], values: T[]) {
  return array.filter(value => !values.includes(value))
}

export default omitArray
