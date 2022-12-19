import { execSync } from 'node:child_process'

function gitAuthor() {
  return {
    name: execSync('git config --get user.name').toString(),
    email: execSync('git config --get user.email').toString(),
  }
}

export default gitAuthor
