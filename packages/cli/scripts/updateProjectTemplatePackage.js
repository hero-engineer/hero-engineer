import fs from 'node:fs'

const rootPackageJsonLocation = 'project-template/package.json'
const appPackageJsonLocation = 'project-template/app/package.json'
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonLocation, 'utf8'))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonLocation, 'utf8'))

rootPackageJson.devDependencies['hero-engineer'] = packageJson.version
appPackageJson.dependencies['@hero-engineer/client'] = packageJson.devDependencies['@hero-engineer/client']

fs.writeFileSync(rootPackageJsonLocation, JSON.stringify(rootPackageJson, null, 2), 'utf8')
fs.writeFileSync(appPackageJsonLocation, JSON.stringify(appPackageJson, null, 2), 'utf8')

console.log(`Updated project template to use hero-engineer@${packageJson.version} and @hero-engineer/client@${packageJson.devDependencies['@hero-engineer/client']}`)
