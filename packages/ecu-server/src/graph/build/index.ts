import chalk from 'chalk'

import { appPath } from '../../configuration.js'

import createDataEcuAttributes from '../../watchers/createDataEcuAttributes.js'
import deleteAllScreenshots from '../../watchers/deleteAllScreenshots.js'

import { deleteGraph } from '../index.js'
import { getGraph } from '../getset.js'

import getAppHash from '../hash/getAppHash.js'
import updateGraphHash from '../hash/updateGraphHash.js'

import commit from '../../git/commit.js'

import buildFilesGraph from './buildFilesGraph.js'

async function buildGraph() {
  const hash = await getAppHash()

  if (getGraph().hash !== hash) {
    console.log(`${chalk.red('!!!')} App hash has changed, rebuilding graph`)

    deleteGraph()
    deleteAllScreenshots()
    await buildFilesGraph()
    await createDataEcuAttributes()
    await updateGraphHash()
    await commit(appPath, 'Rebuild graph')
  }

  console.log(chalk.green('~~~'), `Graph: ${Object.keys(getGraph().nodes).length} nodes`, chalk.gray(`(hash: ${hash})`))
}

export default buildGraph
