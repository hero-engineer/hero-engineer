import { ReactElement } from 'react'

import renderer from './renderer'

function render(element: ReactElement, container: any, callback?: () => void) {
  renderer.updateContainer(element, container._internalRoot, null, callback)
}

export default render
