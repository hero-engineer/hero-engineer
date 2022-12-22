import Postcss from 'postcss'

import { FileType } from '~types'

import createDeferedPromise from '~utils/createDeferredPromise'

const postcss = Postcss()

const allowedCssExtensions = ['css']

export const filePathToCode: Record<string, string> = {}

export const cssReady = createDeferedPromise<void>()

export function addCssSourceFiles(files: FileType[], shouldLog = false) {
  const consoleLog = shouldLog ? console.log : () => {}

  files.forEach(({ path, code }) => {
    if (!allowedCssExtensions.some(extension => path.endsWith(extension))) return

    filePathToCode[path] = code
  })

  consoleLog('css', Object.keys(filePathToCode).length, 'files')

  cssReady.resolve()
}

export function getIndexCss() {
  const filePath = Object.keys(filePathToCode).find(path => path.endsWith('/src/index.css'))

  if (!filePath) {
    throw new Error('File index.css not found!')
  }

  return {
    filePath,
    code: filePathToCode[filePath],
  }
}

export function setIndexCss(code: string) {
  const { filePath } = getIndexCss()

  filePathToCode[filePath] = code
}

export default postcss
