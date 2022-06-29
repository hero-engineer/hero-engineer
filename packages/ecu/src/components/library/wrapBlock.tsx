import { Children, ComponentType, MouseEvent, useContext, useEffect, useRef } from 'react'

import EcuContext from '../../contexts/EcuContext'
import HierarchyContext from '../../contexts/HierarchyContext'

function wrapBlock(Block: ComponentType<any>) {
  return process.env.NODE_ENV === 'production' ? Block : wrapBlockHOC(Block)
}

function wrapBlockHOC(Block: ComponentType<any>) {
  return function EcuWrapper(props: any) {
    const blockRef = useRef<any>()
    const [ecu, setEcu] = useContext(EcuContext)
    const [hierarchyPath, hierarchyIndex] = useContext(HierarchyContext)
    const nextHierarchyPath = `${hierarchyPath}${hierarchyPath ? '>' : ''}${Block.displayName}[${hierarchyIndex}]`
    const isActive = ecu.activeComponentPath === nextHierarchyPath

    function handleClick(event: MouseEvent) {
      event.stopPropagation()
      setEcu(x => ({ ...x, activeComponentPath: nextHierarchyPath }))
    }

    return (
      <div
        onClick={handleClick}
        style={{
          border: isActive ? '1px solid blue' : null,
        }}
      >
        <Block
          ref={blockRef}
          {...props}
        >
          {Children.map(props.children, (child: any, i) => (
            // eslint-disable-next-line
            <HierarchyContext.Provider value={[nextHierarchyPath, i]}>
              {child}
            </HierarchyContext.Provider>
          ))}
        </Block>
      </div>
    )
  }
}

export default wrapBlock
