import { execSync } from 'node:child_process'

// TODO Adjust if yarn must be used
async function installDependencies(cwd: string) {
  execSync('npm install', { cwd })
}

export default installDependencies
