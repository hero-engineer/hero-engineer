import { ComponentType } from 'react'

function wrapBlock(Block: ComponentType<any>) {
  return process.env.NODE_ENV === 'production' ? Block : wrapBlockHOC(Block)
}

function wrapBlockHOC(Block: ComponentType<any>) {
  return function EcuWrapper(props: any) {
    return (
      <Block {...props} />
    )
  }
}

export default wrapBlock
