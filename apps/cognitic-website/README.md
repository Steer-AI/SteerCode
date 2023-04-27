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
│   │   │       ├── stores          // stores for feature XYZ (e.g. agent store, agent store, ...)
│   │   │       └── utils           // utility functions for feature XYZ
│   │   ├── models
│   │   │   ├── classes             // ORM classes (e.g. User model, Agent model, ...)
│   │   │   ├── enums               // enums (e.g. Status, Phase, ...)
│   │   │   ├── interfaces          // interfaces (e.g. IUser interface, IAgent interface, ...)
│   │   │   └── types               // Data types (e.g. User, Settings, Agent, ...)
│   │   ├── shared
│   │   │   ├── components          // shared app components (e.g. button, input, tooltip, ...)
│   │   │   ├── layouts             // shared app layout (e.g. header, footer, ...)
│   │   │   ├── stores              // shared app stores (e.g. user store, settings store, ...)
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
- [Tailwind CSS](https://tailwindcss.com/)

### TODO:

- API requests
- Settings
- Auth/login
- Sentry setup
- Tracking/ Analytics setup
- i18n localization
- Agent message log history (result of tasks)

# local build and deploy to vercel

```
vercel build --prod
vercel deploy --prebuilt --prod
```