function removePaddingEmptyLines(text: string) {
  const textArray = text.split('\n')

  for (const line of [...textArray]) {
    if (line.trim() === '') textArray.shift()
    else break
  }

  for (const line of [...textArray].reverse()) {
    if (line.trim() === '') textArray.pop()
    else break
  }

  return textArray.join('\n')
}

export default removePaddingEmptyLines
