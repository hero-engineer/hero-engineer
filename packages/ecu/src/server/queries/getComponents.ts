import fs from 'fs'

import { ComponentType } from '../../types'

import configuration from '../configuration'

function getComponents(): ComponentType[] {
  return fs.readdirSync(configuration.componentsLocation).map(file => {
    const name = file.replace('.tsx', '')

    return {
      name,
      props: {},
      importName: name,
      importPath: `/components/${name}`,
      importType: 'default',
    }
  })
}

export default getComponents
