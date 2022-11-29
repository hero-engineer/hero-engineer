
import { indexCssFileRelativePath } from '../../configuration.js'
import { CssAttributeType, FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodesByRole } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import updateCssSelector from '../../domain/css/updateCssSelector.js'

type UpdateCssClassMutationArgsType = {
  classNames: string[]
  attributesJson: string
  breakpointMaxValue: number | null
}

async function updateCssClassMutation(_: any, { classNames, attributesJson, breakpointMaxValue }: UpdateCssClassMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__updateCssClassMutation__')

  const indexCssNode = getNodesByRole<FileNodeType>('File').find(node => node.payload.relativePath === indexCssFileRelativePath)

  if (!indexCssNode) {
    throw new Error('index.css file not found')
  }

  let attributes: CssAttributeType[] = []

  try {
    attributes = JSON.parse(attributesJson)
  }
  catch (error) {
    throw new Error('Invalid attributes')
  }

  const selector = classNames.map(x => `.${x}`).join('')

  await updateCssSelector(indexCssNode, selector, attributes, breakpointMaxValue)

  return {
    returnValue: true,
    description: `Edit class '${classNames.join(' ')}'`,
  }
}

export default composeHistoryMutation(updateCssClassMutation)
