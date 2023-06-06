import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from 'path';


// HTTPS + http/2 on dev server?
// https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation
// https://github.com/liuweiGL/vite-plugin-mkcert
// https://vitejs.dev/config/server-options.html#server-https

const config = ({ mode }) => {
  const root = path.join(process.cwd(), '../..')
  const env = loadEnv(mode, root);
  // const env2 = loadEnv(mode, process.cwd());
    // Extends 'process.env.*' with VITE_*-variables from '.env.(mode=production|development)'
  process.env = { ...process.env, ...env };

  const plugins = [
      sveltekit(),
  ]

  // deploy to sentry only for production
  if (process.env.VITE_PUBLIC_ENV === 'production') {
    plugins.push(
      sentryVitePlugin({
        url: `https://sentry.dctr.co/`,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'sentry',
        debug: false,
        project: 'steercode-electron',
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
    server: {
      port: process.env.WEB_PORT || 5173,
    }
  });
};

export default config;