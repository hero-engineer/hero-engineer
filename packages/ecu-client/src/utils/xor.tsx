function xor(a: boolean, b: boolean) {
  return (a || b) && !(a && b)
}

export default xor
