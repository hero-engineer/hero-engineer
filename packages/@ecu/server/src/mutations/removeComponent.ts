import removeComponentInApp from '../domain/removeComponentInApp'

type RemoveComponentArgumentsType = {
  index: string
}

async function removeComponent(parent: any, { index }: RemoveComponentArgumentsType) {
  await removeComponentInApp(index)

  return {
    id: 'noid',
  }
}

export default removeComponent
