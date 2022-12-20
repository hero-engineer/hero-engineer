import { Plugin } from 'vite'

function VitePluginCwd(): Plugin {
  return {
    name: 'vite-plugin-cwd',
    config() {
      process.env.VITE_CWD = process.cwd()
    },
  }
}

export default VitePluginCwd
