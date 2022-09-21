export default (name: string) => `import { Div } from 'ecu-client'

function ${name}(props: any) {
  return (
    <Div>
      Edit me I'm famous
    </Div>
  )
}

export default ${name}`
