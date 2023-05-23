/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // See https://vercel.com/docs/concepts/projects/environment-variables
  // for information about these environment variables
  readonly VERCEL_ENV: 'production' | 'preview' | 'development';
  readonly VERCEL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
  interface Locals {
    /**
     * True for responses with 4xx and 5xx status codes.
     */
    error: boolean;
  }

  // interface Platform {}

  interface Session {
    error: boolean;
  }

  // interface Stuff {}
}
