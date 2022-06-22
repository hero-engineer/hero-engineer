import fs from 'fs'
import path from 'path'

import { ConfigurationType, ExtendedConfigurationType } from './types'

/*
  WARNING: This configuration file works only for the client for now
*/

let currentPath = __dirname

while (currentPath !== '/') {
  const ecuConfigurationFileLocation = path.join(currentPath, '.ecu/config.js')

  if (fs.existsSync(ecuConfigurationFileLocation)) {
    break
  }

  currentPath = path.join(currentPath, '..')
}

let configurationPath
let configuration

try {
  configurationPath = path.join(currentPath, '.ecu')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  configuration = require(path.join(configurationPath, 'config.js')).default as ConfigurationType
}
catch (error) {
  throw new Error('Ecu configuration not found')
}

const appPath = path.join(currentPath, configuration.appRoot || 'app')
const srcPath = path.join(appPath, configuration.srcLocation || 'src')

const extendedConfiguration: ExtendedConfigurationType = {
  ...configuration,
  configurationPath,
  rootPath: currentPath,
  srcPath,
  appPath,
  componentsPath: path.join(srcPath, configuration.componentsLocation || 'components'),
  scenesPath: path.join(srcPath, configuration.scenesLocation || 'scenes'),
}

export default extendedConfiguration
