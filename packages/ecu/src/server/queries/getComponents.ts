import fs from 'fs'
import path from 'path'

import configuration from '../configuration'

function getComponents() {
  const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

  fs.mkdirSync(componentsLocation, { recursive: true })

  return fs.readdirSync(componentsLocation).map(file => {
    const name = file.replace('.tsx', '')
    const content = fs.readFileSync(path.join(componentsLocation, file), 'utf8')

    return {
      name,
      id: name,
      content,
      // ast:
    }
  })
}

export default getComponents
