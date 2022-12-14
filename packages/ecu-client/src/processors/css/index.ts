import Postcss from 'postcss'
import PosscssNested from 'postcss-nested'

import { FileType } from '~types'

const postcss = Postcss([PosscssNested])

const allowedCssExtensions = ['css']

export const filePathToCode: Record<string, string> = {}

export function addCssSourceFiles(files: FileType[], shouldLog = false) {
  const consoleLog = shouldLog ? console.log : () => {}

  files.forEach(({ path, code }) => {
    if (!allowedCssExtensions.some(extension => path.endsWith(extension))) return

    filePathToCode[path] = code
  })

  consoleLog('css', Object.keys(filePathToCode).length)
}

export default postcss