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
import cwd from 'vite-plugin-cwd'

export default defineConfig({
  plugins: [cwd()]
})
```

```js
// src/main.js
console.log(import.meta.env.VITE_CWD) // /path/to/project
```



## License

MIT
