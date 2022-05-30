import { PropsWithChildren, useMemo, useRef, useState } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import { CssBaseline, Div, ThemeProvider, mergeTheme } from 'honorable'
import defaultTheme from 'honorable-theme-default'

import createEcu from '../createEcu'
import withEcuEditor from '../withEcuEditor'

import EcuContext, { EcuContextType } from '../contexts/EcuContext'

import EcuOverlay from './EcuOverlay'

type EcuProps = PropsWithChildren<unknown>

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})

function Ecu({ children }: EcuProps) {
  const childrenRef = useRef<HTMLDivElement>()
  const [ecu, setEcu] = useState(createEcu())
  const ecuValue = useMemo<EcuContextType>(() => [ecu, setEcu], [ecu])

  const ecuTheme = {
    stylesheet: {
      body: [
        {
          minHeight: '100vh',
        },
      ],
    },
  }

  function handleChildrenClick(event: React.MouseEvent) {
    if (event.target === childrenRef.current) {
      setEcu(ecu => ({ ...ecu, activeIndex: null, hoveredIndex: null }))
    }
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={mergeTheme(defaultTheme, ecuTheme)}>
        <CssBaseline />
        <EcuContext.Provider value={ecuValue}>
          <DndProvider backend={HTML5Backend}>
            <EcuOverlay>
              <Div
                ref={childrenRef}
                minHeight="100vh"
                onClick={handleChildrenClick}
              >
                {withEcuEditor(children, ecu)}
              </Div>
            </EcuOverlay>
          </DndProvider>
        </EcuContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Ecu
