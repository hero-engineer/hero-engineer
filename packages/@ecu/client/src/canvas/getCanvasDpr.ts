function getCanvasDpr(_: CanvasRenderingContext2D) {
  const devicePixelRatio = window.devicePixelRatio || 1

  const canvasPixelRatio = (
    // @ts-expect-error
    _.webkitBackingStorePixelRatio
    // @ts-expect-error
    || _.mozBackingStorePixelRatio
    // @ts-expect-error
    || _.msBackingStorePixelRatio
    // @ts-expect-error
    || _.oBackingStorePixelRatio
    // @ts-expect-error
    || _.backingStorePixelRatio
    || 1
  )

  return devicePixelRatio / canvasPixelRatio
}

export default getCanvasDpr
