import appFile from '../constants/appFile'
import appComponent from '../constants/appComponent'

import removeComponentFromHierarchy from '../domain/removeComponentFromHierarchy'

type RemoveComponentArgumentsType = {
  index: string
}

function removeComponent(parent: any, { index }: RemoveComponentArgumentsType): null {
  removeComponentFromHierarchy(appFile, appComponent, index)

  return null
}

export default removeComponent
