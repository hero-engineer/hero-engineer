// import Postcss from 'postcss'
// import PosscssNested from 'postcss-nested'

import { FileType } from '~types'

// const postcss = Postcss([PosscssNested])

const allowedCssExtensions = ['css']

const filePathToCode: Record<string, string> = {}

export function addCssSourceFiles(files: FileType[]) {
  files.forEach(({ path, code }) => {
    if (!allowedCssExtensions.some(extension => path.endsWith(extension))) return

    filePathToCode[path] = code
  })

  console.log('css', Object.keys(filePathToCode).length)
}
