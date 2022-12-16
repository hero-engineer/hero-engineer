import { CssClassType, FileNodeType } from '../../types.js'

import { getNodesByRole } from '../../graph/index.js'

import traverseCss from '../../domain/css/traverseCss.js'

async function cssClassesQuery() {
  const cssFileNodes = getNodesByRole<FileNodeType>('File').filter(node => node.payload.extension === 'css')

  const classes: CssClassType[] = []

  for (const fileNode of cssFileNodes) {
    try {
      const fileNodeClasses = await traverseCss(fileNode)

      classes.push(...fileNodeClasses)
    }
    catch (error) {
      console.error(error)
    }
  }

  return classes
}

export default cssClassesQuery
