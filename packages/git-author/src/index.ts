import gitUserName from 'git-user-name'
// @ts-expect-error
import gitUserEmail from 'git-user-email-2'

function gitAuthor() {
  return {
    name: gitUserName() ?? '',
    email: (gitUserEmail() as string) ?? '',
  }
}

export default gitAuthor
