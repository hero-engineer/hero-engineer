import Ecu from 'ecu'

import MyComponent1 from './components/MyComponent1'
import MyComponent from './components/MyComponent'

function App() {
  return (
    <Ecu>
      
      <MyComponent1 />
      <MyComponent1 /><MyComponent />
      <MyComponent1 />
      <MyComponent />
    </Ecu>
  )
}

export default App
