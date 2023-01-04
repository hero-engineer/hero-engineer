import CoolDiv from './components/CoolDiv'
import CoolDaddy from './components/CoolDaddy'

function App() {
  return (
    <>
      <div className="foo">
        Edit me I'm famous
      </div>
      <div className="foo">
        Edit me I'm famous
      </div>
      <div className="foo">
        Edit me I'm famous
      </div>
      <div className="flex">
        <div className="foo">
          Edit me I'm famous
        </div>
        <div className="foo">
          Edit me I'm famous
        </div>
        <div className="foo">
          Edit me I'm famous
        </div>
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
