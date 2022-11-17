import push from '../../git/push.js'

async function pushMutation() {
  console.log('___pushMutation___')

  return push()
}

export default pushMutation
