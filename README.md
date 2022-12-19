# Hero Engineer

Self reprogrammation rocks!!!

## About

Hero Engineer is a Figma/Webflow open-source alternative that allows anyone to create any app in a fraction of the time required to code it "manually".

It acts as a shield around your app to reprogram it as you create new components, style them, drag-and-drop them into the app, and so on.

## Current features

- Component isolation
- Undo/Redo
- Packages management
- Favicon management
- Dark mode
- Interactive mode

## Working on

- Create components
- Insert component in hierarchy
- Delete component from hierarchy
- Design system
- Fonts and CSS variables management
- Style components

## Roadmap

- Drag-and-drop components
- Props editing
- Routing
- State management
- Context management
- Delete component/file
- App ejection and build

And much more!

## Development

Run `npm i` in the root, `packages/cli`, `packages/server` and `packages/client`  directories.

Run `npm run dev` in the `packages/cli`, `packages/server` and `packages/client` directories.

Etheir:
- Use [the shared dev Hero Engineer app](https://github.com/dherault/ecu-app) for a lot of boilerplate and use cases: `cd ..` then `git clone git@github.com:dherault/ecu-app.git` then `cd ecu-app` then `npm i` then `cd app` then `npm i`.
- Use a blank new Hero Engineer app for a project creation developer experience: create an empty git repository at `../ecu-app` (`cd .. && mkdir ecu-app && cd ecu-app && git init`). Run `npx ecu create` in `ecu-app`.

Go back to `../hero-engineer` and run `npm run link`. You Hero Engineer app at `../ecu-app` now uses the dev version of Hero Engineer.

Finally, in `../ecu-app` run `npm run serve` in a first terminal and `npm run dev` in another one. You can now open the link given by ViteJS to view the live app using Hero Engineer. :tada:

## License

MIT
