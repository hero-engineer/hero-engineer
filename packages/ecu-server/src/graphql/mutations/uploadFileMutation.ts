import fs from 'node:fs'
import path from 'node:path'
import { finished } from 'node:stream/promises'

// @ts-expect-error
import Upload from 'graphql-upload/Upload.mjs'

import { appPath } from '../../configuration.js'
import { HistoryMutationReturnType } from '../../types.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type UploadImageMutationMutationArgsType = {
  file: Upload
  fileName: string
}

async function uploadFileMutation(_: any, { file }: UploadImageMutationMutationArgsType): Promise<HistoryMutationReturnType<string>> {
  const { createReadStream, filename /* , mimetype, encoding */ } = await file

  const stream = createReadStream()
  const fileLocation = path.join(appPath, 'public', filename)
  const out = fs.createWriteStream(fileLocation)

  stream.pipe(out)

  await finished(out)

  return {
    returnValue: `/${filename}`,
    description: `Upload file ${filename}`,
  }
}

export default composeHistoryMutation(uploadFileMutation)
