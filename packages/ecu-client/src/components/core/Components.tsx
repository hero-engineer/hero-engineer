import { Link } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div, H1 } from 'honorable'

import { refetchKeys } from '../../constants'

import { ComponentsQuery, ComponentsQueryDataType } from '../../queries'

import useRefetch from '../../hooks/useRefetch'

import ComponentThumbnail from './ComponentThumbnail'

function Components() {
  const [componentsQueryResult, refetchComponentsQuery] = useQuery<ComponentsQueryDataType>({
    query: ComponentsQuery,
    requestPolicy: 'network-only',
  })

  useRefetch({
    key: refetchKeys.components,
    refetch: refetchComponentsQuery,
  })

  if (componentsQueryResult.error) {
    return null
  }
  if (!componentsQueryResult.data?.components) {
    return null
  }

  const { components } = componentsQueryResult.data

  return (
    <>
      <H1 mt={1}>Components</H1>
      <Div
        mt={2}
        xflex="x11"
        gap={1}
      >
        {components.map(componentAndFile => (
          <Link
            key={componentAndFile.component.address}
            to={`/_ecu_/component/${componentAndFile.file.address}/${componentAndFile.component.address}`}
            style={{ textDecoration: 'none' }}
          >
            <ComponentThumbnail
              address={componentAndFile.component.address}
              name={componentAndFile.component.payload.name}
              description={componentAndFile.file.payload.description}
              emoji={componentAndFile.file.payload.emoji}
            />
          </Link>
        ))}
      </Div>
    </>
  )
}

export default Components
