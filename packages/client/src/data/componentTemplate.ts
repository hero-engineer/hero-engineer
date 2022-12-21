export default (name: string) => `function ${name}() {
  return (
    <div>
      ${name}
    </div>
  )
}

export default ${name}
`
