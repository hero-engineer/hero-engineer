import { ComponentType } from '../../types'

import generatePropsString from './generatePropsString'

function generateComponentString(component: ComponentType): string {
  const { children, ...otherProps } = component.props

  if (children) {
    return `<${component.name} ${generatePropsString(otherProps)}>${children.map(generateComponentString)}</${component.name}>`
  }

  return `<${component.name} ${generatePropsString(otherProps)} />`
}

export default generateComponentString
