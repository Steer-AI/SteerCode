/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VITE_PUBLIC_ENV: string;
      readonly VERCEL_ENV: 'production' | 'preview' | 'development';
      readonly VERCEL_URL: string;
    }
  }

  interface ImportMetaEnv {
    readonly VITE_PUBLIC_ENV: string;
    // See https://vercel.com/docs/concepts/projects/environment-variables
    // for information about these environment variables
    readonly VERCEL_ENV: 'production' | 'preview' | 'development';
    readonly VERCEL_URL: string;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
