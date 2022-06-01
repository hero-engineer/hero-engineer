import removeComponentFromHierarchy from '../domain/removeComponentFromHierarchy'

type RemoveComponentArgumentsType = {
  index: string
}

async function removeComponent(parent: any, { index }: RemoveComponentArgumentsType) {
  console.log('removeComponent', index)

  await removeComponentFromHierarchy('App', 'App', index)

  return {
    id: 'noid',
  }
}

export default removeComponent
