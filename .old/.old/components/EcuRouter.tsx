import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import Home from '../scenes/Home'
// import Scenes from '../scenes/Scenes.tsx.old'
import Components from '../scenes/Components'
import EditComponent from '../scenes/EditComponent'
import SemanticTokens from '../scenes/SemanticTokens'

import Layout from './Layout'

function EcuRouter({ children }: any) {
  return (
    <Router>
      <Routes>
        <Route
          path="/_ecu_"
          element={<Layout />}
        >
          <Route
            index
            element={<Home />}
          />
          {/* <Route
            path="scenes"
            element={<Scenes />}
          /> */}
          <Route
            path="components"
            element={<Components />}
          >
            <Route
              path=":id"
              element={<EditComponent />}
            />
          </Route>
          <Route
            path="semantic-tokens"
            element={<SemanticTokens />}
          />
        </Route>
        <Route
          path="*"
          element={children}
        />
      </Routes>
    </Router>
  )
}

export default EcuRouter
