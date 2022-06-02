import { FileType } from '../../types'

import configuration from '../configuration'

const appFile: FileType = {
  name: 'App.tsx',
  path: configuration.appPath,
  relativePath: configuration.appLocation,
}

export default appFile
