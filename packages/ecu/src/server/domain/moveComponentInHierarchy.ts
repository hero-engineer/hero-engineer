import { ComponentType, FileType } from '../../types'

import removeComponentFromHierarchy from './removeComponentFromHierarchy'
import insertComponentInHierarchy from './insertComponentInHierarchy'

function moveComponentInHierarchy(
  file: FileType,
  sourceComponent: ComponentType,
  targetComponent: ComponentType,
  sourceIndex: string,
  targetIndex: string,
  position: 'before' | 'after',
) {
  removeComponentFromHierarchy(file, sourceComponent, sourceIndex)

  let nextTargetIndex = targetIndex

  if (sourceIndex < targetIndex) {
    const lastIndexPosition = sourceIndex.split('.').length - 1
    const targetIndexArray = targetIndex.split('.')

    targetIndexArray[lastIndexPosition] = `${parseInt(targetIndexArray[lastIndexPosition]) - 1}`
    nextTargetIndex = targetIndexArray.join('.')
  }

  insertComponentInHierarchy(file, sourceComponent, targetComponent, nextTargetIndex, position)
}

export default moveComponentInHierarchy
