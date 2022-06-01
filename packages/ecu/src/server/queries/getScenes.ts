import fs from 'fs'
import path from 'path'

import { SceneType } from '../../types'

import configuration from '../configuration'

const scenesLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/scenes')

function getScenes(): SceneType[] {
  return fs.readdirSync(scenesLocation).map(file => {
    const name = file.replace('.tsx', '')
    // const content = fs.readFileSync(path.join(scenesLocation, file), 'utf8')

    return {
      id: name,
      name,
      // content,
    }
  })
}

export default getScenes
