// eslint-disable-next-line
const path = require('path')

module.exports = function override(config, env) {
  Object.assign(config.resolve.alias, {
    'ecu-configuration': path.resolve(__dirname, '.ecu'),
  })

  return config
}
