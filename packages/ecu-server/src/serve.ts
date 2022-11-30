import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { ApolloServer } from 'apollo-server'
import express from 'express'
import cors from 'cors'
import chalk from 'chalk'

import { resolvers, typeDefs } from './graphql/index.js'

import buildGraph from './graph/build/index.js'

import getEcuLocation from './helpers/getEcuLocation.js'

async function serve() {
  await buildGraph()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cors: {
      origin: '*',
    },
  })

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(chalk.green('~~~'), `🚀 Ecu GraphQL server ready at ${url}`)
  })

  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const app = express()

  app.use(cors())
  app.use('/.ecu', express.static(getEcuLocation()))
  app.use('/emojis', express.static(path.join(__dirname, '../data/emojis')))

  app.listen(4001)

  console.log(chalk.green('~~~'), '🚀 Ecu static  server ready at http://localhost:4001/')
}

export default serve
