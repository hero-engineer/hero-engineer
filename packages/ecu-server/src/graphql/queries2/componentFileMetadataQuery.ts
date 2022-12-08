import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'

type ComponentQueryArgsType = {
  path: string
}

function componentFileMetadataQuery(_: any, { path }: ComponentQueryArgsType) {
  return {
    decoratorPaths: [],
  }
}

export default componentFileMetadataQuery
