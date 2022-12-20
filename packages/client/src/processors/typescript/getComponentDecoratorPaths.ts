import { projectReady } from '~processors/typescript'

async function getComponentDecoratorPaths(cwd: string, componentPath: string, shouldLog = false) {
  await projectReady.promise

  return [
    `${cwd}/src/decorators/HeroEngineerDecorator.tsx`,
  ]
}

export default getComponentDecoratorPaths
