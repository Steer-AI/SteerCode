# How it works?

Template utilizes [electron-vite](https://github.com/alex8088/electron-vite) for its ability to bundle & compile node.js (main & renderer files) to V8 Bytecode.
Template doesn't use `renderer` part of [electron-vite](https://github.com/alex8088/electron-vite), but rather embeds [SvelteKit](https://kit.svelte.dev/) into the project as sub-project in `src/renderer` directory with it's own dependencies. SvelteKit is configured with [adapter-static](https://kit.svelte.dev/docs/adapter-static) to build SPA (Single Page Application) with static HTML/CSS/JS.
Esentially it gives the best of both worlds:

- Electron (backend) from [electron-vite](https://github.com/alex8088/electron-vite)
- Anything you can think of with SvelteKit (within the limits of [adapter-static](https://kit.svelte.dev/docs/adapter-static))

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
yarn install # installs dependencies of `electron-vite`
cd src/renderer && yarn install # installs dependencies of SvelteKit
cd ../../ # gets back to the source directory
```

## Development

### Quick start:

```bash
yarn dev # command starts 2 subcommands in parallel using `concurrently` npm package
```

### If you need new dependencies for SvelteKit:

```bash
cd src/renderer # navigate to SvelteKit directory & do things from there
```

(!!!) Don't forget to go back to source directory with `cd ../../` after you installed necessary dependencies.

## Build

```bash
# For windows
yarn build:win

# For macOS
yarn build:mac

# For Linux
yarn build:linux
```

## local build with code signing requirements

1. setup your APPLE_ID and APPLE_ID_PASSWORD env variables

   - Sign in to appleid.apple.com to get an App-Specific password
   - Click on App-Specific passwords
   - Click on Plus icon and follow the instructions to get an App specific password.
   - Copy the App specific password and put it in the APPLE_ID_PASSWORD env variable
   - set APPLE_ID to your apple ID

2. get a signing certificates (.p12 files) and install them on your system

   - mor more info follow https://www.electron.build/code-signing

3. get Apple Worldwide Developer Relations Certification Authority and Developer ID Certification Authority certificates

   - (Mac only) easiest way is do open an XCode > settings > accounts tab
     - add your developer accout
     - under your account select a team and click on "manage certificates"
     - XCode should automatically add missing certificates to your keychain

4. run build `yarn build:{platform}`

   - it will run a svelte build then electron build
   - after both builds are complete. Electron-builder will bundle all build outputs
   - Electron-builder will try to locate a Developer ID Application certificate and Developer ID InstInstaller certificate on your system and use them to sign the application
     - you might be prompted to enter the keychain password
   - signed application will be uploaded to apple's server for notarization (this might take 5-10 mins)

- for more detail see https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

## local publish

1. add GH_TOKEN env variable. Follow https://github.com/settings/tokens/new
2. update package version (if needed)
3. run `yarn release`
