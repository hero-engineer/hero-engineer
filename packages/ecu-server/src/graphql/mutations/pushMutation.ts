import push from '../../git/push.js'

async function pushMutation() {
  console.log('__pushMutation__')

  return push()
}

export default pushMutation
