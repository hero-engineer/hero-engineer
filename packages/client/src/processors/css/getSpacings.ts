import getVariables from './getVariables'

async function getSpacings() {
  const variables = await getVariables()

  return variables.filter(({ type }) => type === 'spacing')
}

export default getSpacings
