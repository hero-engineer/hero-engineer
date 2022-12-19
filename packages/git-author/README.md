# git-author

Read git author name and email from config.

## Installation

`npm i -S git-author`

## Usage

```js
import gitAuthor from 'git-author'

console.log(gitAuthor()) // { name: 'John Doe', email: 'john.doe@gmail.com' } or if the values are not set: { name: '', email: '' }
```

## LICENSE

MIT
