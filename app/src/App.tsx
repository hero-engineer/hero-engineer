import { Ecu } from '@ecu/client'

/* ecu-imports */
import MyComponent from './components/MyComponent'

function App() {
  return (
    <Ecu>
      <MyComponent />
      <MyComponent />
      <MyComponent />
      <MyComponent />
    </Ecu>
  )
}

export default App
