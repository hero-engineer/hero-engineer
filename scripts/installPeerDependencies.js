// eslint-disable-next-line
const cp = require('child_process');

// eslint-disable-next-line
// const { peerDependencies } = require('../packages/ecu/package.json')

cp.execSync(`\
  rm -rf app/node_modules/ecu\
  && mkdir app/node_modules/ecu\
  && cp -r packages/ecu/package.json app/node_modules/ecu/package.json\
  && cp -r packages/ecu/dist app/node_modules/ecu\
  && cp -r packages/ecu/src app/node_modules/ecu
`)
