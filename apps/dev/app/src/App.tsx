import CoolDiv from './components/CoolDiv'
import CoolDaddy from './components/CoolDaddy'

function App() {
  return (
    <>
      <div>
        Edit me I'm famous
      </div>
      <CoolDiv />
      <CoolDaddy>
        <CoolDiv />
        <div>
          Edit me I'm famous too
        </div>
      </CoolDaddy>
    </>
  )
}

export default App
