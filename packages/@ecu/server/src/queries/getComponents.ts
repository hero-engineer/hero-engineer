import fs from 'fs'
import path from 'path'

import configuration from '../configuration'

function getComponents() {
  const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

  fs.mkdirSync(componentsLocation, { recursive: true })

  return fs.readdirSync(componentsLocation).map(file => ({
    id: file.replace('.tsx', ''),
    name: file.replace('.tsx', ''),
    content: fs.readFileSync(path.join(componentsLocation, file), 'utf8'),
  }))
}

export default getComponents
