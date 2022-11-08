import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'

import { ComponentTypesQuery, ComponentTypesQueryDataType } from '../../queries'

function ComponentTypesEditor() {
  const { componentAddress = '' } = useParams()
  const [componentTypesQueryResult] = useQuery<ComponentTypesQueryDataType>({
    query: ComponentTypesQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
  })

  console.log('componentTypesQueryResult.data', componentTypesQueryResult.data)

  return (
    <Div>
      ComponentTypesEditor
    </Div>
  )
}

export default ComponentTypesEditor
