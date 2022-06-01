import fs from 'fs'
import path from 'path'

let currentPath = __dirname

while (currentPath !== '/') {
  const ecuConfigurationFileLocation = path.join(currentPath, 'ecu.config.js')

  if (fs.existsSync(ecuConfigurationFileLocation)) {
    break
  }

  currentPath = path.join(currentPath, '..')
}

let configuration

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  configuration = require(path.join(currentPath, 'ecu.config.js')).default
}
catch (error) {
  throw new Error('Ecu configuration not found')
}

const srcLocation = path.join(currentPath, configuration.appRoot, 'src')

export default {
  ...configuration,
  rootLocation: currentPath,
  srcLocation,
  componentsLocation: path.join(srcLocation, 'components'),
  scenesLocation: path.join(srcLocation, 'scenes'),
}
