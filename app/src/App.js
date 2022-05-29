import { createContext, Children, useMemo, useState, useContext, cloneElement,isValidElement, useCallback, useRef, forwardRef, useEffect } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import hotKeys from 'react-piano-keys'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider, useDrag, useDrop } from 'react-dnd'

import { ThemeProvider, CssBaseline, mergeTheme, Div, useForkedRef } from 'honorable'
import defaultTheme from 'honorable-theme-default'

function App() {
  return (
    <Ecu>
      <Div border="1px solid blue">
        <Div border="1px solid blue">
          <Div border="1px solid blue">
            Child 1
          </Div>
          <Div border="1px solid blue">
            Child 2
          </Div>
          <Div border="1px solid blue">
            <Div border="1px solid green">
              Child 1
            </Div>
            <Div border="1px solid green">
              Child 2
            </Div>
            <Div border="1px solid green">
              Child 3
            </Div>
          </Div>
        </Div>
      </Div>
    </Ecu>
  );
}

const EcuContext = createContext({});

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

function createEcu() {
  return {
    hoveredIndex: null,
    dragIndex: null,
    dragHoveredIndex: null,
    dragRect: null,
    dragMousePosition: { x: 0, y: 0 },
    createEditorId: () => Math.random(),
  }
}

function EcuEditorRef({ children, index }, ref) {
  const rootRef = useRef()
  const forkedRef = useForkedRef(ref, rootRef)
  const [ecu, setEcu] = useContext(EcuContext)
  const { dragHoveredIndex, dragMousePosition , dragRect} = ecu
  const [dragPlaceholderPosition, setDragPlaceholderPosition] = useState(null)

  useEffect(() => {
    if (dragHoveredIndex === index) {
      const rect = rootRef.current.getBoundingClientRect()

      setDragPlaceholderPosition(dragMousePosition.y - rect.top < rect.height / 2 ? 'top' : 'bottom')

      return
    }

    setDragPlaceholderPosition(null)
  }, [dragHoveredIndex, index, dragMousePosition])

  const [{ handlerId }, drop] = useDrop({
    accept: 'component',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!rootRef.current) {
        return
      }

      const dragIndex = item.index
      const dragHoveredIndex = index

      // Don't replace items with themselves
      // if (dragIndex === dragHoveredIndex) {
      //   return
      // }

      const dragMousePosition = monitor.getClientOffset()

      // console.log('dragHoveredIndex', dragHoveredIndex)

      setEcu(ecu => ({...ecu,  dragIndex, dragHoveredIndex, dragMousePosition}))
      // Determine rectangle on screen

      // Time to actually perform the action


      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // item.index = dragHoveredIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: () => ({ id: index, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => {
      setEcu(ecu => ({
        ...ecu,
         dragIndex: null,
          dragHoveredIndex: null,
           dragRect: null,
           }))
    },
  })

  useEffect(() => {
    if (isDragging) {
      const dragRect = rootRef.current.getBoundingClientRect()

      setEcu(ecu => ({ ...ecu, dragRect }))
    }
  }, [isDragging, setEcu])

  // const opacity = isDragging ? 0 : 1
  drag(drop(rootRef))

  return (
    <Div ecu={index} ref={forkedRef}>
      {dragRect && dragPlaceholderPosition === 'top' && (
        <Div width={dragRect.width} height={dragRect.height} backgroundColor="chartreuse" />
      )}
      <Div
        p={0.5}
        border="1px solid gold"
        borderColor={ecu.hoveredIndex === index ? 'red' : 'gold'}
        onMouseEnter={() => setEcu(ecu => ({ ...ecu, hoveredIndex: index }))}
        onMouseLeave={() => setEcu(ecu => ({ ...ecu, hoveredIndex: null }))}
      >
        {children}
      </Div>
      {dragRect && dragPlaceholderPosition === 'bottom' && (
        <Div width={dragRect.width} height={dragRect.height} backgroundColor="pink" />
      )}
    </Div>
  )
}

const EcuEditor = forwardRef(EcuEditorRef)

function Ecu({ children }) {
  const [ecu, setEcu] = useState(createEcu())
  const ecuValue = useMemo(() => [ecu, setEcu], [ecu])

  const ecuTheme = {
    StyleSheet: {
      body: [
        {
          position: 'relative',
        }
      ]
    }
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={mergeTheme(defaultTheme, ecuTheme)}>
        <CssBaseline />
        <EcuContext.Provider value={ecuValue}>
          <DndProvider backend={HTML5Backend}>
            <EcuOverlay>
              {withEcuEditor(children, ecu)}
            </EcuOverlay>
          </DndProvider>
        </EcuContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

function EcuOverlay({ children }) {
  const [isVisible, setIsVisible] = useState(false)

  hotKeys(document.documentElement, 'space', (event) => {
    event.preventDefault()
    setIsVisible(x => !x)
  })

  return (
    <>
      {isVisible && (
        <>
          <ComponentsList position="fixed" top={0} left={0} />
        </>
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

function ComponentsList(props) {
  const { data, loading, error } = useQuery(COMPONENTS_LIST_QUERY)

  if (loading || error) {
    return null
  }

  return (
    <Div border="1px solid border" {...props}>
      {data.components.map(component => (
        <ComponentListItem key={component.id} component={component} />
      ))}
    </Div>
  )
}

function ComponentListItem({ component }) {
  return (
    <Div>
      {component.name}
    </Div>
  )
}

function withEcuEditor(children, ecu, index = '') {
  return Children.map(children, (child, i) => {
    if (isValidElement(child)) {
      const nextIndex =  index + (index ? '.' : '') + i
      return (
        <>
          <EcuEditor key={child.key} index={nextIndex}>
            {cloneElement(child, {
              children: typeof child?.props?.children !== 'undefined' ? withEcuEditor(child.props.children, ecu, nextIndex) : null
            })}
          </EcuEditor>
        </>
      )
    }

    return child
  });
}

export default App;
