import { Component, ReactNode } from 'react'

type WithComponentErrorPropsType = {
  children: ReactNode
}

type WithComponentErrorStateType = {
  error: any
}

class WithComponentError extends Component<WithComponentErrorPropsType, WithComponentErrorStateType> {
  constructor(props: WithComponentErrorPropsType) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <h1 style={{ margin: 0, fontFamily: '"Inter", sans-serif' }}>Something went wrong</h1>
          <pre style={{ marginTop: 16, marginBottom: 0 }}>{this.state.error.message ?? JSON.stringify(this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

export default WithComponentError
