/* jshint esversion: 11 */

const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const mode = process.env.PUBLIC_ENV;
const dev = mode === 'staging' || mode === 'development';

const config = {
  plugins: [
    tailwindcss(),
    autoprefixer({
      cascade: true
    }),
    !dev &&
      cssnano({
        preset: 'default'
      })
  ]
};

module.exports = config;
