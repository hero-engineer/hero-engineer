import * as git from 'isomorphic-git'

import getAppRepository from './getAppRepository.js'

async function createCommit(cwd: string, message: string) {
  try {
    const repository = await getAppRepository(cwd)

    console.log('repository.dir', repository.dir)

    // git add . -A
    // https://isomorphic-git.org/docs/en/snippets#git-add-a-
    await git.statusMatrix(repository).then(status =>
      Promise.all(
        status.map(([filepath, , worktreeStatus]) =>
          worktreeStatus ? git.add({ ...repository, filepath }) : git.remove({ ...repository, filepath })
        )
      )
    )

    await git.commit({
      ...repository,
      message,
    })
  }
  catch (error) {
    console.log(error)

    throw new Error('Commit creation failed')
  }
}

export default createCommit
