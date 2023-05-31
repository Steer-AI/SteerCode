import {
  bytecodePlugin,
  defineConfig,
  externalizeDepsPlugin
} from 'electron-vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  }
  // renderer: {}
});
