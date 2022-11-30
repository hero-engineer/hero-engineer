import chalk from 'chalk'

function withLog<T>(queryOrMutation: (...args: any[]) => T, isMutation = false) {
  const name = queryOrMutation.name.slice(0, -(isMutation ? 'Mutation' : 'Query').length)

  return async (...args: Parameters<typeof queryOrMutation>) => {
    console.log(`${chalk.yellow('-->')} ${chalk[isMutation ? 'magenta' : 'blue'](name)}`)

    const start = Date.now()
    const result = await queryOrMutation(...args)
    const end = Date.now()

    console.log(`${chalk.yellow('<--')} ${chalk[isMutation ? 'magenta' : 'blue'](name)} (${end - start}ms)`)

    return result
  }
}

export default withLog
