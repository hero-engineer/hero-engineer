import fs from 'fs'
import path from 'path'

import { ComponentType } from '../../types'

import configuration from '../configuration'

const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

function getComponents(): ComponentType[] {
  return fs.readdirSync(componentsLocation).map(file => {
    const name = file.replace('.tsx', '')
    // const content = fs.readFileSync(path.join(componentsLocation, file), 'utf8')

    return {
      id: name,
      name,
      // content,
    }
  })
}

export default getComponents
