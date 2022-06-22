import registerPlugins from './shared/registerPlugins'
import serverGraph from './server/graph'
import buildServerGraph from './server/graph/build'
import clientGraph from './client/graph'
import buildClientGraph from './client/graph/build'

if (typeof window === 'undefined') {
  buildServerGraph(registerPlugins(serverGraph))
}
else {
  buildClientGraph(registerPlugins(clientGraph))
}

export { default as Ecu } from './client/components/library/Ecu'
export { default as wrapBlock } from './client/components/library/wrapBlock'
