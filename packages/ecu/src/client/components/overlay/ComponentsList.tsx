import { gql, useMutation, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { A, Div, Flex } from 'honorable'

import { COMPONENTS_QUERY } from '../../queries'

function ComponentsList(props: any) {
  const { data, loading, error } = useQuery(COMPONENTS_QUERY)

  if (loading || error) {
    return null
  }

  const sortedComponents = [...data.components].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Div
      borderRight="1px solid border"
      {...props}
    >
      {sortedComponents.map((component: any) => (
        <ComponentListItem
          key={component.id}
          component={component}
        />
      ))}
    </Div>
  )
}

type ComponentListItemProps = {
  component: any
}

const ADD_COMPONENT_MUTATION = gql`
  mutation AddComponentMutation($name: String!, $index: String!, $position: String!) {
    addComponent(name: $name, index: $index, position: $position) {
      id
    }
  }
`

function ComponentListItem({ component }: ComponentListItemProps) {
  const [mutation] = useMutation(ADD_COMPONENT_MUTATION, {
    variables: {
      name: component.name,
      index: '0.0',
      position: 'before',
    },
  })

  return (
    <Flex
      align="center"
      px={1}
      py={0.5}
      borderBottom="1px solid border"
      onClick={() => mutation()}
    >
      {component.name}
      <Div flexGrow={1} />
      <A
        as={Link}
        to={`/_ecu_/component/${component.id.replaceAll('/', '_')}`}
        ml={1}
      >
        edit
      </A>
    </Flex>
  )
}

export default ComponentsList
