import path from 'path'

import { FileType } from '../../types'

import configuration from '../configuration'

const appFile: FileType = {
  name: 'App.tsx',
  location: path.join(configuration.rootPath, configuration.appRoot, 'src'),
}

export default appFile
