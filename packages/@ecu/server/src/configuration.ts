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
  configuration = require(path.join(currentPath, 'ecu.config.js')).default
}
catch (error) {
  throw new Error('Ecu configuration not found')
}

export default {
  ...configuration,
  rootPath: currentPath,
}
