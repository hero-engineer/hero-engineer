import fs from 'node:fs'

const rootPackageJsonLocation = 'project-template/package.json'
const appPackageJsonLocation = 'project-template/app/package.json'
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonLocation, 'utf8'))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonLocation, 'utf8'))

rootPackageJson.devDependencies.ecu = packageJson.version
appPackageJson.dependencies.ecu = packageJson.version

fs.writeFileSync(rootPackageJsonLocation, JSON.stringify(rootPackageJson, null, 2))
fs.writeFileSync(appPackageJsonLocation, JSON.stringify(appPackageJson, null, 2))

console.log(`Updated project template to use Ecu ${packageJson.version}`)
