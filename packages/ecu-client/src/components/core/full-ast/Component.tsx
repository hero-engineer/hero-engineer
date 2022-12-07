import { useParams } from 'react-router-dom'

import { convertFromEcuComponentPath } from '@utils/convertComponentPath'

import ComponentWindow from '@core/component-window/ComponentWindow'

function Component() {
  const { '*': relativePath = '' } = useParams()

  if (!relativePath) return null

  return (
    <ComponentWindow
      componentPath={`/Users/sven/dev/ecu-app/app/src/${convertFromEcuComponentPath(relativePath)}`}
      decoratorPaths={[]}
    />
  )
}

export default Component
