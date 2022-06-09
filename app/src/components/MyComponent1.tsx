function MyComponent1(props: any) {
  const { children, otherProps } = props

  return (
    <div {...otherProps}>
      <p>Component1 before</p>
      {children}
      <p>Component1 after</p>
    </div>
  )
}

export default MyComponent1
