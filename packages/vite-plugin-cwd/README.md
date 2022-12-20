# vite-plugin-cwd

Inject the app's current working directory into the browser.

## Installation

```bash
npm i -D vite-plugin-cwd
```

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite'
import vitePluginCwd from 'vite-plugin-cwd'

export default defineConfig({
  plugins: [vitePluginCwd()]
})
```

## License

MIT
