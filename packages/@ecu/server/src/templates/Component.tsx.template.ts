export default (name: string) => `import { Div } from 'honorable'

function ${name}(props: any) {
  return (
    <Div>
      {props.children}
    </Div>
  )
}

export default ${name}`
