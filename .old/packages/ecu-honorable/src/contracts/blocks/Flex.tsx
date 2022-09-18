import { Particule, createAddress } from 'ecu-particule'
import { Ref, forwardRef } from 'react'
import { Flex } from 'honorable'

function FlexBlockRef({ style, behavior, children }: any, ref: Ref<any>) {
  return (
    <Flex
      ref={ref}
      {...style}
      {...behavior}
    >
      {children}
    </Flex>
  )
}

const flexBlockParticule: Particule = {
  address: createAddress(),
  role: 'Block:Flex',
  payload: {},
  workload: forwardRef(FlexBlockRef),
}

export default flexBlockParticule
