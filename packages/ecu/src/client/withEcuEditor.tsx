import { Children, ReactNode, cloneElement, isValidElement } from 'react'

import { EcuType } from '../types'

import EcuEditor from './components/EcuEditor'

function withEcuEditor(children: ReactNode, ecu: EcuType, index = '0') {
  return Children.map(children, (child, i) => {
    if (isValidElement(child)) {
      const nextIndex = `${index}.${i}`

      return (
        <EcuEditor
          key={child.key}
          index={nextIndex}
        >
          {cloneElement(child, {
            children: typeof child?.props?.children !== 'undefined' ? withEcuEditor(child.props.children, ecu, nextIndex) : null,
          })}
        </EcuEditor>
      )
    }

    return child
  })
}

export default withEcuEditor
