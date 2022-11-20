import { createClient } from 'urql'

// Create an urql client
export default createClient({
  url: 'http://localhost:4000/graphql',
})
