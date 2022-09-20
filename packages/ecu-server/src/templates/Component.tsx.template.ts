export default (name: string, id: string) => `function ${name}(props: any) {
  return (
    <div
      id="${id}"
      {...props}
    >
      Hello I'm famous
    </div>
  )
}

export default ${name}`
