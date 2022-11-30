import chalk from 'chalk'

function withLog<T>(queryOrMutation: (...args: any[]) => T, name: string, isMutation = false) {
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
