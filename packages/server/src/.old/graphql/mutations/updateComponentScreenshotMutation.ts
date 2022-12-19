import path from 'node:path'

import sharp from 'sharp'

import { FunctionNodeType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import getHeroEngineerScreenshotsLocation from '../../helpers/getHeroEngineerScreenshotsLocation.js'

type UpdateComponentScreenshotMutationArgsType = {
  sourceComponentAddress: string
  dataUrl: string
}

async function updateComponentScreenshotMutation(_: any, { sourceComponentAddress, dataUrl }: UpdateComponentScreenshotMutationArgsType) {
  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`Component ${componentNode} not found`)
  }

  try {
    await sharp(Buffer.from(dataUrl.split(',')[1], 'base64'))
      .trim()
      .toFile(path.join(getHeroEngineerScreenshotsLocation(), `${componentNode.address}.png`))
  }
  catch (error) {
    console.log(error)

    throw new Error('Error while creating component screenshot')
  }

  return true
}

export default updateComponentScreenshotMutation
