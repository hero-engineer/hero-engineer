import fs from 'node:fs'

import * as git from 'isomorphic-git'

import { appPath } from '../configuration'

const repo = {
  fs,
  dir: appPath,
}

async function createCommit(message: string) {
  console.log('___createCommit___')

  // git add . -A
  // https://isomorphic-git.org/docs/en/snippets#git-add-a-
  await git.statusMatrix(repo).then(status =>
    Promise.all(
      status.map(([filepath, , worktreeStatus]) =>
        worktreeStatus ? git.add({ ...repo, filepath }) : git.remove({ ...repo, filepath })
      )
    )
  )

  await git.commit({
    ...repo,
    message,
  })
}

export default createCommit
