## What's inside?

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `cognitic-website`: a [SvelteKit](https://kit.svelte.dev/) app running in https://steercode.com/
- `steercode-app`: a [SvelteKit](https://kit.svelte.dev/) app running in the [Electron](https://www.electronjs.org/)

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).


## FAQ

### How to compile an run steercode-app electron app?

```sh
# install dependencies 
yarn install

# go to app root directory
cd apps/steercode-app-electron

# (optional) run dev server
yarn dev

#  compile the app
yarn build
```
- all outputs will be in the /apps/steercode-app-electron/dist directory

### How to deploy steercode-app to sentry?
1. go to sentry https://sentry.dctr.co/settings/account/api/auth-tokens/
2. create new api key. with following permissions
    - project:read
    - project:releases
    - org:read
3. put your auth token to SENTRY_AUTH_TOKEN in the /apps/steercode-app-electron/.env file
4. set VITE_PUBLIC_ENV env variable to 'production'
4. run `yarn build`  
