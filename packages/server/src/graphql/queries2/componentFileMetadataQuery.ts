import getComponentDecoratorPaths from '../../domain/components/getComponentDecoratorPaths.js'

type ComponentQueryArgsType = {
  path: string
}

function componentFileMetadataQuery(_: any, { path }: ComponentQueryArgsType) {
  return {
    decoratorPaths: getComponentDecoratorPaths(path),
  }
}

export default componentFileMetadataQuery
