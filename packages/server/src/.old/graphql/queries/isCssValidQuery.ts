import isCssValid from '../../domain/css/isCssValid.js'

type IsCssValidQueryArgsType = {
  css: string
}

function isCssValidQuery(_: any, { css }: IsCssValidQueryArgsType) {
  return {
    isCssValid: isCssValid(css),
    css,
  }
}

export default isCssValidQuery
