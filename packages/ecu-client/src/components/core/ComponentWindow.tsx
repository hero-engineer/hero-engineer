import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'

type ComponentWindowPropsType = {
  componentPath: string
}

function ComponentWindow({ componentPath }: ComponentWindowPropsType) {
  return (
    <ComponentIframe>
      <WithIsComponentRefreshingLayer>
        <ComponentLoader componentPath={componentPath} />
      </WithIsComponentRefreshingLayer>
    </ComponentIframe>
  )
}

export default ComponentWindow
