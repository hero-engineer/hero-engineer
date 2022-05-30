import fs from 'fs'
import path from 'path'

import configuration from '../configuration'

import template from '../templates/Component.tsx.template'

const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

function createComponent() {
  let index = 0
  let name = 'MyComponent'

  fs.readdirSync(componentsLocation).forEach(file => {
    if (file.startsWith(name)) {
      index++
    }
  })

  name += index > 0 ? index : ''

  const content = template(name)
  const componentLocation = path.join(componentsLocation, `${name}.tsx`)

  fs.writeFileSync(componentLocation, content, 'utf8')

  return {
    id: name,
    name,
    content,
  }
}

export default createComponent
