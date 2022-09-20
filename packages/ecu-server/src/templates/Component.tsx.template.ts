export default (name: string) => `function ${name}(props: any) {
  return (
    <div {...props}>
      Hello I'm famous
    </div>
  )
}

export default ${name}`
