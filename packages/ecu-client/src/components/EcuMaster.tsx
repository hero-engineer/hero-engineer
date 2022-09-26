import { Suspense, lazy, useContext, useMemo, useState } from 'react'
import { Provider, useMutation, useQuery } from 'urql'
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'

import client from '../client'
import { AddComponentMutation, ComponentQuery, ComponentsQuery, CreateComponentMutation } from '../queries'

import ModeContext from '../contexts/ModeContext'
import EditionContext, { EditionContextType } from '../contexts/EditionContext'

type EcuMasterProps = {
  mode?: string
}

function EcuMaster({ mode = 'production' }: EcuMasterProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const editionContextValue = useMemo<EditionContextType>(() => ({ selectedId, setSelectedId }), [selectedId])

  return (
    <ModeContext.Provider value={mode}>
      <EditionContext.Provider value={editionContextValue}>
        <Provider value={client}>
          <Router>
            <Overlay />
          </Router>
        </Provider>
      </EditionContext.Provider>
    </ModeContext.Provider>
  )
}

function Overlay() {
  const [componentName, setComponentName] = useState('')
  const [, createComponent] = useMutation(CreateComponentMutation)
  const navigate = useNavigate()

  function handleCreateComponentClick() {
    createComponent({ name: componentName })
    .then(result => {
      console.log('result', result)
      navigate(`/__ecu__/component/${result.data.createComponent.id}`)
    })
  }

  return (
    <div>
      <input
        value={componentName}
        onChange={e => setComponentName(e.target.value)}
      />
      <button
        onClick={handleCreateComponentClick}
        type="button"
      >
        Create component
      </button>
      <Link to="/__ecu__/components">
        Components
      </Link>
    </div>
  )
}

function AddComponentButton() {
  const { selectedId } = useContext(EditionContext)
  const [, addComponent] = useMutation(AddComponentMutation)

  function handleAddComponentClick() {
    addComponent({ name: componentName })
  }

  return (
    <button
      onClick={handleAddComponentClick}
      type="button"
    >
      Add component
    </button>
  )
}

function Router({ children }: any) {
  return (
    <BrowserRouter>
      {children}
      <Routes>
        <Route
          path="/__ecu__"
          element={<Layout />}
        >
          <Route
            path="components"
            element={<Components />}
          />
          <Route
            path="component/:id"
            element={<Component />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Layout() {
  return (
    <div>
      <h1>Ecu</h1>
      <Outlet />
    </div>
  )
}

function Components() {
  const [componentsQueryResult] = useQuery({
    query: ComponentsQuery,
  })

  if (componentsQueryResult.fetching) return null
  if (componentsQueryResult.error) return null

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

function Component() {
  const { id } = useParams()
  const [componentQueryResult] = useQuery({
    query: ComponentQuery,
    variables: {
      id,
    },
  })

  if (componentQueryResult.fetching) return null
  if (componentQueryResult.error) return null
  if (!componentQueryResult.data.component) return null

  return (
    <>
      <h2>{componentQueryResult.data.component.name}</h2>
      <p>{componentQueryResult.data.component.file.relativePath}</p>
      <ComponentEditor component={componentQueryResult.data.component} />
    </>
  )
}

function ComponentEditor({ component }: any) {
  const Component = lazy(() => import(/* @vite-ignore */ component.file.path))

  return (
    <Suspense fallback={<>Loading...</>}>
      <Component />
    </Suspense>
  )
}

export default EcuMaster
