import getVariables from './getVariables'

async function getColors() {
  const variables = await getVariables()

  return variables.filter(({ type }) => type === 'color')
}

export default getColors
