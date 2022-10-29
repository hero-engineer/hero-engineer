import { memo } from 'react'
import { useQuery } from 'urql'
import { Link } from 'react-router-dom'
import { H2, Li, Ul } from 'honorable'

import { ComponentsQuery } from '../../queries'

function Components() {
  const [componentsQueryResult] = useQuery({
    query: ComponentsQuery,
  })

  if (componentsQueryResult.fetching) {
    return null
  }
  if (componentsQueryResult.error) {
    return null
  }

  return (
    <>
      <H2>Components</H2>
      <Ul>
        {componentsQueryResult.data.components.map((component: any) => (
          <Li key={component.id}>
            <Link to={`/__ecu__/component/${component.id}`}>
              {component.name}
            </Link>
          </Li>
        ))}
      </Ul>
    </>
  )
}

export default memo(Components)
