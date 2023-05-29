import { withSentryConfig } from '@sentry/svelte';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
  compilerOptions: {
    enableSourcemap: true
  },
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
      sourceMap: true,
      preserve: ['partytown']
    })
  ],
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return;
    }
    handler(warning);
  },
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    // prerender: { entries: [] },
    alias: {
      $styles: './src/styles/',
      $lib: './src/lib/',
      $app: './.svelte-kit/runtime/app/'
    }
  },

  vitePlugin: {
    inspector: true // use cmd + shift to open inspector
  }
};

/** @type {import('@sveltejs/kit').Config} */
export default withSentryConfig(config, {
  componentTracking: {
    // Add the components you want to be tracked to this array.
    // Specificy `true` to track all components or `false` to disable
    // tracking entirely
    // (defaults to `true`)
    trackComponents: true,
    // To disable component initialization spans, set this to `false`.
    // (defaults to `true`)
    trackInit: true,
    // To disable component update spans, set this to `false`
    // (defaults to `true`)
    trackUpdates: false
  }
});
