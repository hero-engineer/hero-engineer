import fs from 'node:fs'
import path from 'node:path'

import * as git from 'isomorphic-git'

import getAppRepository from './getAppRepository.js'
import appendToEcuHistoryFile from './appendToEcuHistoryFile.js'

async function undo() {
  const repository = await getAppRepository()
  const undoBranchName = `undo-${Date.now()}`
  const enhancedRepository = { ...repository, ref: undoBranchName }

  // git checkout undo-123
  await git.checkout(enhancedRepository)

  const commits = await git.log({
    ...enhancedRepository,
    depth: 1,
  })

  if (!commits.length) {
    throw new Error('Nothing to undo')
  }

  const hash = commits[0].commit.tree

  // git reset --hard HEAD~1
  // Reset the branch
  fs.writeFileSync(path.join(repository.dir, `.git/refs/heads/${undoBranchName}`), hash)
  // Clear the index (if any)
  fs.unlinkSync(path.join(repository.dir, '.git/index'))
  // Checkout the branch into the working tree
  await git.checkout(enhancedRepository)

  // write current branch to ecu history file
  appendToEcuHistoryFile(undoBranchName)
}

export default undo
