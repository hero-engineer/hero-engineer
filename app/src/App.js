import { createContext, Children, useMemo, useState, useContext, cloneElement,isValidElement, useCallback, useRef } from 'react'
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

import { ThemeProvider, CssBaseline, mergeTheme, Div } from 'honorable'
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
            Child 3
          </Div>
        </Div>
      </Div>
    </Ecu>
  );
}

const EcuContext = createContext({});
const EcuDragContext = createContext(() => {});

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

function createEcu() {
  return {
    hoveredId: null,
    createEditorId: () => Math.random(),
  }
}

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

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    console.log('dragIndex, hoverIndex', dragIndex, hoverIndex)
  }, [])

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={mergeTheme(defaultTheme, ecuTheme)}>
        <CssBaseline />
        <EcuContext.Provider value={ecuValue}>
          <EcuDragContext.Provider value={moveCard}>
          <DndProvider backend={HTML5Backend}>
            <EcuOverlay>
              {withEcuEditor(children)}
            </EcuOverlay>
          </DndProvider>
          </EcuDragContext.Provider>
        </EcuContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

function EcuOverlay({ children }) {
  const [isVisible, setIsVisible] = useState(true)

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

function withEcuEditor(children, id = '0') {
  return Children.map(children, (child, i) => {
    if (isValidElement(child)) {
      return (
        <EcuEditor key={child.key} id={id}>
          {cloneElement(child, {
            children: typeof child?.props?.children !== 'undefined' ? withEcuEditor(child.props.children, id + '.' + i) : null
          })}
        </EcuEditor>
      )
    }

    return child
  });
}

function EcuEditor({ children, id }) {
  const ref = useRef(null)
  const [ecu, setEcu] = useContext(EcuContext)
  const moveCard = useContext(EcuDragContext)

  const [{ handlerId }, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = id

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // // Determine rectangle on screen
      // const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // // Get vertical middle
      // const hoverMiddleY =
      //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // // Determine mouse position
      // const clientOffset = monitor.getClientOffset()
      // // Get pixels to the top
      // const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%
      // // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return
      // }
      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return
      // }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index: id }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <Div
      ref={ref}
      p={0.5}
      border="1px solid gold"
      borderColor={ecu.hoveredId === id ? 'red' : 'gold'}
      onMouseEnter={() => console.log(id) || setEcu(ecu => ({ ...ecu, hoveredId: id }))}
    >
      {children}
    </Div>
  )
}

export default App;
