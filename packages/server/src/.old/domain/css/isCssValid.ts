import path from 'node:path'

import postcss from 'postcss'
import posscssNested from 'postcss-nested'
import stylelint from 'stylelint'

const postcssInstance = postcss([
  posscssNested,
  stylelint({
    config: {
      extends: path.join(process.cwd(), 'node_modules/hero-engineer/node_modules/hero-engineer-server/node_modules', 'stylelint-config-standard'),
    },
  }),
])

async function isCssValid(css: string) {
  return postcssInstance.process(css, { from: 'isCssValid' })
    .then(() => true)
    .catch(() => false)
}

export default isCssValid
