import { execSync } from 'node:child_process'

import { appPath } from '../configuration.js'

import commit from '../git/commit.js'

import createDeferredPromise, { DeferredPromiseType } from '../utils/createDeferredPromise.js'

type ExecQueueItem = {
  cmd: string
  commitMessage: string
  deferedPromise: DeferredPromiseType<boolean>
}

let isFlushing = false
const execQueue: ExecQueueItem[] = []

async function addToExecQueue(cmd:string, commitMessage: string) {
  const deferedPromise = createDeferredPromise<boolean>()

  execQueue.push({
    cmd,
    commitMessage,
    deferedPromise,
  })

  flushExecQueue()

  return deferedPromise.promise
}

async function flushExecQueue() {
  if (!execQueue.length) return
  if (isFlushing) return

  isFlushing = true

  const { cmd, commitMessage, deferedPromise } = execQueue.shift() as ExecQueueItem

  try {
    execSync(cmd, { cwd: appPath, stdio: 'inherit' })

    await commit(appPath, commitMessage)

    deferedPromise.resolve(true)
  }
  catch (error) {
    deferedPromise.reject(error)
  }

  isFlushing = false

  await flushExecQueue()
}

export default addToExecQueue
