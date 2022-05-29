import { PropsWithChildren, useState } from 'react'
import {
  gql,
  useQuery,
} from '@apollo/client'
import hotKeys from 'react-piano-keys'

import { Div } from 'honorable'

type EcuOverlayProps = PropsWithChildren<unknown>

function EcuOverlay({ children }: EcuOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  hotKeys(document.documentElement, 'space', event => {
    event.preventDefault()
    setIsVisible(x => !x)
  })

  return (
    <>
      {isVisible && (
        <ComponentsList
          position="fixed"
          top={0}
          left={0}
        />
      )}
      {children}
    </>
  )
}

const COMPONENTS_LIST_QUERY = gql`
  query ComponentsList {
    components {
      id
      name
      content
    }
  }
`

function ComponentsList(props: any) {
  const { data, loading, error } = useQuery(COMPONENTS_LIST_QUERY)

  if (loading || error) {
    return null
  }

  return (
    <Div
      border="1px solid border"
      {...props}
    >
      {data.components.map((component: any) => (
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

function ComponentListItem({ component }: ComponentListItemProps) {
  return (
    <Div>
      {component.name}
    </Div>
  )
}

export default EcuOverlay
