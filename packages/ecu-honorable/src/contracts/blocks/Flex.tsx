import { Particule, createAddress } from 'ecu-particule'
import { Flex } from 'honorable'

const flexBlockParticule: Particule = {
  address: createAddress(),
  role: 'Block:Flex',
  payload: {},
  workload: function FlexBlock({ style, behavior, children }: any) {
    return (
      <Flex
        {...style}
        {...behavior}
      >
        {children}
      </Flex>
    )
  },
}

export default flexBlockParticule
