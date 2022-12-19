import getComponentDecoratorPaths from '../../domain/components/getComponentDecoratorPaths.js'

type ComponentMetadataQueryArgsType = {
  componentPath: string
}

function componentMetadataQuery(_: any, { componentPath }: ComponentMetadataQueryArgsType) {
  return {
    decoratorPaths: getComponentDecoratorPaths(componentPath),
  }
}

export default componentMetadataQuery
