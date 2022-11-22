export type DeferredPromiseType<T> = {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: any) => void
}

function createDeferedPromise<T>() {
  const deferred: Partial<DeferredPromiseType<T>> = {}

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred as DeferredPromiseType<T>
}

export default createDeferedPromise
