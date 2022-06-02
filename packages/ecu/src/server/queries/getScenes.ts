import fs from 'fs'
// import path from 'path'

import { SceneType } from '../../types'

import configuration from '../configuration'

function getScenes(): SceneType[] {
  return fs.readdirSync(configuration.scenesLocation).map(file => {
    const name = file.replace('.tsx', '')

    return {
      name,
      url: '/',
    }
  })
}

export default getScenes
