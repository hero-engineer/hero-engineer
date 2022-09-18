export default (name: string) => `import { Div } from 'honorable'

function ${name}(props: any) {
  return (
    <Div />
  )
}

export default ${name}`
