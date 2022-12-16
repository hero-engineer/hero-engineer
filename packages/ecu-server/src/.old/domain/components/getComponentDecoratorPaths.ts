import fs from 'node:fs'
import path from 'node:path'

import { appPath, ecuCommonDecoratorName, ecuDecoratorNameSuffix, ecuDecoratorsRelativeLocation } from '../../configuration.js'
import { FunctionNodeType } from '../../types.js'
import possiblyAddExtension from '../../utils/possiblyAddExtension.js'

function getComponentDecoratorPaths(componentNode: FunctionNodeType) {
  const decoratorsLocation = path.join(appPath, ecuDecoratorsRelativeLocation)

  const decorators: string[] = [
    path.join(decoratorsLocation, possiblyAddExtension(ecuCommonDecoratorName, 'tsx')),
  ]

  const files = fs.readdirSync(decoratorsLocation)

  files.forEach(file => {
    const fileName = path.basename(file, path.extname(file))
    const decoratorName = componentNode.payload.name + ecuDecoratorNameSuffix

    if (fileName === decoratorName) {
      decorators.push(path.join(decoratorsLocation, possiblyAddExtension(decoratorName, 'tsx')))
    }
  })

  return decorators
}

export default getComponentDecoratorPaths
