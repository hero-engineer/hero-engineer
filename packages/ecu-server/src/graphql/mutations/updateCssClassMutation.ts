
import { indexCssFileRelativePath } from '../../configuration.js'
import { CssAttributeType, FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodesByRole } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import readBreakpoints from '../../domain/css/readBreakpoints.js'
import updateCssSelector from '../../domain/css/updateCssSelector.js'

type UpdateCssClassMutationArgsType = {
  classNames: string[] // Support for chained classes
  breakpointId: string
  attributesJson: string
}

async function updateCssClassMutation(_: any, { classNames, breakpointId, attributesJson }: UpdateCssClassMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
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

  const breakpoints = readBreakpoints()
  const breakpoint = breakpoints.find(breakpoint => breakpoint.id === breakpointId)

  if (!breakpoint) {
    throw new Error(`Breakpoint ${breakpointId} not found`)
  }

  const selector = classNames.map(x => `.${x}`).join('')

  await updateCssSelector(indexCssNode, selector, attributes, breakpoint)

  return {
    returnValue: true,
    description: `Edit class '${classNames.join(' ')}'`,
  }
}

export default composeHistoryMutation(updateCssClassMutation)
