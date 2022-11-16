import gitUserName from 'git-user-name'
// @ts-expect-error
import gitUserEmail from 'git-user-email-2'

function getGitAuthor() {
  return {
    name: gitUserName() ?? '',
    email: gitUserEmail() ?? '',
  }
}

export default getGitAuthor
