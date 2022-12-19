import fs from 'node:fs'

type FileQueryArgsType = {
  filePath: string
}

function fileQuery(_: any, { filePath }: FileQueryArgsType) {
  return fs.readFileSync(filePath, 'utf8')
}

export default fileQuery
