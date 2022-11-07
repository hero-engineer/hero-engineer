import { memo } from 'react'
import { useQuery } from 'urql'
import { Link } from 'react-router-dom'
import { H2, Li, Ul } from 'honorable'

import { ComponentsQuery, ComponentsQueryDataType } from '../../queries'

function Components() {
  const [componentsQueryResult] = useQuery<ComponentsQueryDataType>({
    query: ComponentsQuery,
    requestPolicy: 'network-only',
  })

  if (componentsQueryResult.fetching) {
    return null
  }
  if (componentsQueryResult.error) {
    return null
  }
  if (!componentsQueryResult.data) {
    return null
  }

  const { components } = componentsQueryResult.data

  return (
    <>
      <H2>Components</H2>
      <Ul mt={2}>
        {components.map((component: any) => (
          <Li key={component.address}>
            <Link to={`/__ecu__/component/${component.address}`}>
              {component.payload.name}
            </Link>
          </Li>
        ))}
      </Ul>
    </>
  )
}

export default memo(Components)
