// eslint-disable-next-line
const path = require('path')

module.exports = function override(config, env) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'ecu-configuration': path.resolve(__dirname, '.ecu'),
      },
    },
  }
}
