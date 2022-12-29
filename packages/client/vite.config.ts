import path from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const isProductionBuild = process.env.PRODUCTION_BUILD === 'true'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    isProductionBuild && dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    minify: isProductionBuild,
    sourcemap: isProductionBuild,
    emptyOutDir: isProductionBuild,
    outDir: 'build',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'hero-engineer-client',
    },
    rollupOptions: {
      plugins: [
        typescriptPaths({ preserveExtensions: true }),
      ],
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
