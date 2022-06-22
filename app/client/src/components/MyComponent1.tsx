import { Flex } from 'ecu'

function MyComponent1({ children }: any) {
  return (
    <Flex>
      component1 before 2
      <Flex>Component1 before</Flex>
      {children}
      <Flex>Component1 after</Flex>
      component1 after 2
    </Flex>
  )
}

export default MyComponent1
