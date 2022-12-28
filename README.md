<p align="center">
  <a href="https://hero.engineer">
    <img src="assets/logo-swords-white-bg.png" width="200">
  </a>
<p>

Low-code tool to build web apps of any complexity.

## About

Hero Engineer is a revolutionary open-source platform that makes it easy for anyone to build custom web apps. Whether you're a seasoned developer or just starting out, Hero Engineer allows you to create sophisticated and powerful apps in a fraction of the time it would take to code them manually. With its intuitive interface and streamlined development process, you'll have everything you need to bring your app ideas to life.

One of the key advantages of Hero Engineer is its Turing completeness, which enables you to write any feature that a seasoned developer would write. This means that with Hero Engineer, you have the power to create apps of any degree of sophistication. Whether you're a developer yourself or new to app development, Hero Engineer makes it easy to bring your ideas to life.

So why wait? Try Hero Engineer today and see just how easy it is to create the app of your dreams.

## How

With Hero Engineer, you can easily reprogram your app on the fly as you perform actions such as creating new components, drag-and-dropping them, and styling them. Our platform acts as a wrapper around your app, allowing you to make real-time updates and see the results in your browser, where most of the computation happens. The server part is there only to access the file system.

Once you are ready to fly on your onw, you can eject the tooling and you'll be left with an easy to code upon, fully functional app, with technologies that are easy to learn and hire for such as TypeScript, ReactJS and CSS.

## Current features

- Create components
- Component isolation
- Undo/Redo
- Packages management
- Fonts and CSS variables management
- Favicon management
- Dark mode
- Interactive mode

## Working on

- Insert component in hierarchy
- Delete component from hierarchy
- Design system
- Style components

## Roadmap

Here is the [temporary roadmap](TODO.md).

## Development

Run `npm i` in the root, `packages/cli`, `packages/server`, `packages/client`, `apps/dev` and `apps/dev/app` directories (here is a command for that: `npm i && cd packages/cli && npm i && cd ../server && npm i && cd ../client && npm i && cd ../../apps/dev && npm i && cd app && npm i && cd ../../..`)

Run `npm run link` in the root directory.

Run `npm run dev:core` in the root directory.

Run `npm run serve` and `npm run dev` in the `apps/dev` directory. You may want to use two terminals for that.

You can now open the link given by ViteJS to view the live app using Hero Engineer. :tada:

## License

MIT
