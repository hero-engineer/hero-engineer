import createDeferredPromise, { DeferredPromiseType } from '../utils/createDeferredPromise.js'

type ExecQueueItem<T> = {
  handler: () => Promise<T>
  deferedPromise: DeferredPromiseType<T>
}

let isFlushing = false
const execQueue: ExecQueueItem<any>[] = []

async function addToExecQueue<T>(handler: () => Promise<T>) {
  const deferedPromise = createDeferredPromise<T>()

  execQueue.push({
    handler,
    deferedPromise,
  })

  flushExecQueue<T>()

  return deferedPromise.promise
}

async function flushExecQueue<T>() {
  if (!execQueue.length) return
  if (isFlushing) return

  isFlushing = true

  const { handler, deferedPromise } = execQueue.shift() as ExecQueueItem<T>

  try {
    const retval = await handler()

    deferedPromise.resolve(retval)
  }
  catch (error) {
    deferedPromise.reject(error)
  }

  isFlushing = false

  await flushExecQueue()
}

export default addToExecQueue
