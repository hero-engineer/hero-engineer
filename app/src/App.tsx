import { Ecu } from '@ecu/client'

import MyComponent1 from './components/MyComponent1'
import MyComponent from './components/MyComponent'

function App() {
  return (
    <Ecu>
      <MyComponent1 />
      <MyComponent />
      <MyComponent />
      <MyComponent />
      <MyComponent1 />
    </Ecu>
  )
}

export default App
