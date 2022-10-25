import { memo } from 'react'
import { useQuery } from 'urql'
import { Link } from 'react-router-dom'

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
      <h2>Components</h2>
      <ul>
        {componentsQueryResult.data.components.map((component: any) => (
          <li key={component.id}>
            <Link to={`/__ecu__/component/${component.id}`}>
              {component.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default memo(Components)
