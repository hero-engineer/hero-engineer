import { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import { CssBaseline, Div, ThemeProvider, mergeTheme } from 'honorable'
import defaultTheme from 'honorable-theme-default'

import createEcu from '../createEcu'
import withEcuEditor from '../withEcuEditor'
import client from '../client'

import { EcuContextType } from '../../types'

import EcuContext from '../contexts/EcuContext'

import EcuRouter from './EcuRouter'
import EcuOverlay from './overlay/EcuOverlay'

type EcuProps = PropsWithChildren<unknown>

const theme = mergeTheme(defaultTheme, {
  stylesheet: {
    body: [
      {
        minHeight: '100vh',
      },
    ],
  },
})

console.log('theme', theme)

function Ecu({ children }: EcuProps) {
  const childrenRef = useRef<HTMLDivElement>()
  const [ecu, setEcu] = useState(createEcu())
  const ecuValue = useMemo<EcuContextType>(() => [ecu, setEcu], [ecu])

  function handleChildrenClick(event: React.MouseEvent) {
    if (event.target === childrenRef.current) {
      setEcu(ecu => ({
        ...ecu,
        activeComponent: null,
        activeComponentIndex: null,
      }))
    }
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <EcuContext.Provider value={ecuValue}>
          <DndProvider backend={HTML5Backend}>
            <EcuRouter>
              <EcuOverlay>
                <Div
                  ref={childrenRef}
                  minHeight="100vh"
                  onClick={handleChildrenClick}
                >
                  {withEcuEditor(children, ecu)}
                </Div>
              </EcuOverlay>
            </EcuRouter>
          </DndProvider>
        </EcuContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default Ecu
