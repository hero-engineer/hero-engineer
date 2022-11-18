import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const isProductionBuild = process.env.PRODUCTION_BUILD === 'true'

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic' }),
    cssInjectedByJsPlugin(),
    isProductionBuild && dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    minify: isProductionBuild,
    sourcemap: true,
    outDir: 'build',
    emptyOutDir: isProductionBuild,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ecu-client',
      formats: ['es'],
      // formats: ['es', 'umd],
      fileName: format => `ecu-client.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
