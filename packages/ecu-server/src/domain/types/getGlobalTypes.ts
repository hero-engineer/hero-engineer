import fs from 'node:fs'
import path from 'node:path'

import { appPath, globalTypesFileBegginingComment, globalTypesFileRelativePath } from '../../configuration'

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

function getGlobalTypes() {
  const globalTypesFileContent = fs.readFileSync(path.join(appPath, globalTypesFileRelativePath), 'utf8')

  let finalGlobalTypesFileContent = removePaddingEmptyLines(globalTypesFileContent)

  if (globalTypesFileContent.startsWith(globalTypesFileBegginingComment)) {
    finalGlobalTypesFileContent = finalGlobalTypesFileContent.slice(globalTypesFileBegginingComment.length)
  }

  return {
    globalTypesFileContent: removePaddingEmptyLines(finalGlobalTypesFileContent),
  }
}

export default getGlobalTypes
