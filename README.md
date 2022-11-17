# ecu

A self-reprogramming shield for React apps

## About

Ecu is a Figma open-source alternative that allows React developers to create any app in a fraction of the time required to code it "manually".

It acts as a shield around your app to reprogram it as you create new components, style them, drag-and-drop them into the app, and so on.

## Current features

- Create components
- Insert component in hierarchy
- Delete component from hierarchy
- Manage component imports
- Manage component prop types
- Manage global types
- Undo/Redo

## Roadmap

- Style components
- Drag-and-drop components
- State management

And much more!

## Development

Run `npm i` in the root, `packages/ecu`, `packages/ecu-client`, and `packages/ecu-server` directories.

Run `npm run dev` in the `packages/ecu`, `packages/ecu-server` and `packages/ecu-client` directories.

Etheir:
- To use the shared dev ecu app: `cd ..` then `git clone git@github.com:dherault/ecu-app.git` then `cd ecu-app` then `npm i` then `cd app` then `npm i`.
- To use a blank new one: Create an empty git repository at `../ecu-app` (`cd .. && mkdir ecu-app && cd ecu-app && git init`). Run `npx ecu create` in `ecu-app` to create a new Ecu app.

Go back to `../ecu` and run `npm run link`. You Ecu App at `../ecu-app` now uses the dev version of Ecu.

Finally, in `../ecu-app` run `npm run serve` in a first terminal and `npm run dev` in another one. You can now open the link given by ViteJS to view the live app using Ecu. :tada:

## License

MIT
