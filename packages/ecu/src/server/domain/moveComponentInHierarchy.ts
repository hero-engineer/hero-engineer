import removeComponentFromHierarchy from './removeComponentFromHierarchy'
import insertComponentInHierarchy from './insertComponentInHierarchy'

async function moveComponentInHierarchy(
  fileName: string,
  componentName: string,
  insertedComponentFileName: string,
  insertedComponentName: string,
  sourceIndex: string,
  targetIndex: string,
  position: 'before' | 'after',
) {
  await removeComponentFromHierarchy(fileName, componentName, sourceIndex)

  let nextTargetIndex = targetIndex

  if (sourceIndex < targetIndex) {
    const lastIndexPosition = sourceIndex.split('.').length - 1
    const targetIndexArray = targetIndex.split('.')

    targetIndexArray[lastIndexPosition] = `${parseInt(targetIndexArray[lastIndexPosition]) - 1}`
    nextTargetIndex = targetIndexArray.join('.')
  }

  console.log('sourceIndex, targetIndex, nextTargetIndex', sourceIndex, targetIndex, nextTargetIndex, position)

  await insertComponentInHierarchy(fileName, componentName, insertedComponentFileName, insertedComponentName, nextTargetIndex, position)
}

export default moveComponentInHierarchy
