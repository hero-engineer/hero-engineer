import { Ecu } from 'ecu'

import MyComponent1 from './components/MyComponent1'
import MyComponent2 from './components/MyComponent2'

function App() {
  return (
    <Ecu>
      <MyComponent1>
        <MyComponent2 />
        <MyComponent2 />
        <MyComponent2 />
      </MyComponent1>
    </Ecu>
  )
}

export default App
