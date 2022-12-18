import fs from 'node:fs'
import path from 'node:path'

import { appPath, faviconEndComment, faviconStartComment } from '../../configuration.js'

import insertBetweenComments from '../comments/insertBetweenComments.js'

function updateFavicon(url: string) {
  const indexHtmlFileLocation = path.join(appPath, 'index.html')
  const indexHtmlFileContent = fs.readFileSync(indexHtmlFileLocation, 'utf8')

  const code = insertBetweenComments(indexHtmlFileContent, faviconStartComment, faviconEndComment, `<link rel="icon" href="${url}" />`)

  fs.writeFileSync(indexHtmlFileLocation, code)
}

export default updateFavicon
