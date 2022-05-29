// import fs from 'fs'
// import path from 'path'

// import configuration from '../configuration'

// import template from '../templates/Component.tsx.template'

type DragComponentArgumentsType = {
  index: string
  nextIndex: string
  position: 'after' | 'before'
}

function createComponent(parent: any, { index, nextIndex, position }: DragComponentArgumentsType) {
  // const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')
  // const componentLocation = path.join(componentsLocation, `${name}.tsx`)

  // fs.mkdirSync(componentsLocation, { recursive: true })

  // const content = template(name)

  // fs.writeFileSync(componentLocation, content, 'utf8')

  // return {
  //   name,
  //   content,
  // }
}

export default createComponent
