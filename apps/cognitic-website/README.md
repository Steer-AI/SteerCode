## Code Structure

sveltekit documentation: https://kit.svelte.dev/docs/introduction

```term
├── src
│   ├── lib
│   │   ├── core
│   │   │   └── services            // core app services
│   │   │       └── auth
│   │   ├── data                    // data used in app (e.g. mocked data for storybook, contract Abis for quickbuy, ...)
│   │   │   └── mockData
│   │   ├── features
│   │   │   └── XYZ
│   │   │       ├── components      // components for feature XYZ (e.g. card, menu button, countdown, ...)
│   │   │       ├── layouts         // layout for feature XYZ (e.g. table, sidebar, menu, ...)
│   │   │       ├── stores          // stores for feature XYZ (e.g. user store, cart store, ...)
│   │   │       └── utils           // utility functions for feature XYZ
│   │   ├── models
│   │   │   ├── classes             // ORM classes (e.g. User model, Collection model, ...)
│   │   │   ├── enums               // enums (e.g. Aggregator, Marketplace, Rarity, Period, ...)
│   │   │   ├── interfaces          // ???
│   │   │   └── types               // Data types (e.g. Order, Asset, Collection, ...)
│   │   ├── shared
│   │   │   ├── components          // shared app components (e.g. buttons, inputs, tooltips, ...)
│   │   │   ├── layouts             // shared app layout (e.g. header, footer, ...)
│   │   │   ├── stores              // shared app stores (e.g. user store, cart store, data feed store, ...)
│   │   │   └── utils               // shared utility functions
│   ├── routes
│   │   ├── XYZ
│   │   └── api
│   │       └── XYZ
│   └── styles                      // Project CSS classes definitions
├── static
```

https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript

## Tech stack

- [Svelte](https://svelte.dev/)
- [Sveltekit](https://kit.svelte.dev/)
- [RXJS](https://rxjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Dev guideline

https://www.npmjs.com/package/@sentry/sveltekit
https://github.com/getsentry/sentry-javascript/issues/6692


# local build and deploy

```
vercel build --prod
vercel deploy --prebuilt --prod
```