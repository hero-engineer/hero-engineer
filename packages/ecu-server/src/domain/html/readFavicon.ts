import fs from 'node:fs'
import path from 'node:path'

import { appPath, faviconEndComment, faviconStartComment } from '../../configuration.js'

import extractBetweenComments from '../comments/extractBetweenComments.js'

const faviconRegex = /href="(.*)"/

function readFavicon() {
  const indexHtmlFileLocation = path.join(appPath, 'index.html')

  const indexHtmlFileContent = fs.readFileSync(indexHtmlFileLocation, 'utf8')

  const faviconNode = extractBetweenComments(indexHtmlFileContent, faviconStartComment, faviconEndComment)

  const faviconMatch = faviconNode.match(faviconRegex)

  return faviconMatch ? faviconMatch[1] : ''
}

export default readFavicon
