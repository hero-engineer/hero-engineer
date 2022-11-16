import { execSync } from 'node:child_process'

async function installDependencies(cwd: string) {
  execSync('npm install', { cwd })
}

export default installDependencies
