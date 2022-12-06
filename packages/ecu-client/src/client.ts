import { cacheExchange, createClient, dedupExchange } from 'urql'

import { persistedFetchExchange } from '@urql/exchange-persisted-fetch'
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch'

// Create an urql client
export default createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    headers: {
      'Content-type': 'application/json',
      'Apollo-Require-Preflight': 'true',
    },
  },
  exchanges: [
    dedupExchange,
    cacheExchange,
    persistedFetchExchange({
      preferGetForPersistedQueries: true,
    }),
    multipartFetchExchange,
  ],
})
