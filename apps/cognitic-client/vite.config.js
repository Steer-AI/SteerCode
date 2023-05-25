import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from "@sentry/vite-plugin";


// HTTPS + http/2 on dev server?
// https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation
// https://github.com/liuweiGL/vite-plugin-mkcert
// https://vitejs.dev/config/server-options.html#server-https

const config = ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
    // Extends 'process.env.*' with VITE_*-variables from '.env.(mode=production|development)'
  process.env = { ...process.env, ...env };

  const plugins = [
      sveltekit(),
  ]

  if (process.env.VITE_PUBLIC_ENV === 'production') {
    plugins.push(
      sentryVitePlugin({
        url: `https://${process.env.SENTRY_HOST}/`,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'sentry',
        debug: false,
        project: process.env.SENTRY_PROJECT_NAME,
        // Specify the directory containing build artifacts
        include: ['./.svelte-kit/output/client'],
        setCommits: {
          auto: true,
          ignoreMissing: true,
          ignoreEmpty: true,
        },
        deploy: {
          env: process.env.VITE_PUBLIC_ENV
        },
        // urlPrefix: '~/.svelte-kit/output/',
        ignore: ['node_modules', '**/~partytown'],
      })
    )
  }

  return defineConfig({
    plugins,
    build: {
      sourcemap: true,
    },
    resolve: {
      preserveSymlinks: true
    },
  });
};

export default config;