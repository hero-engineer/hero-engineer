import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'

type ComponentQueryArgsType = {
  relativePath: string
}

function componentFileQuery(_: any, { relativePath }: ComponentQueryArgsType) {
  const componentPath = path.join(appPath, 'src', relativePath)

  return {
    content: fs.readFileSync(componentPath, 'utf8'),
    decoratorPaths: [],
  }
}

export default componentFileQuery
