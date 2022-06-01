import { Ecu } from '@ecu/client'

import MyComponent1 from './components/MyComponent1'
import MyComponent from './components/MyComponent'

function App() {
  return (
    <Ecu>
      <MyComponent /><MyComponent1 />
      
      <MyComponent1 />
      
      <MyComponent1 /><MyComponent />
    </Ecu>
  )
}

export default App
