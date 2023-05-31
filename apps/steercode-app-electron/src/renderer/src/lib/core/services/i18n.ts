// src/lib/i18n/index.ts
import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('../../data/locales/en.json'));

let initialLocale = defaultLocale;
if (browser) {
  initialLocale =
    localStorage.getItem('cognitic.locale') || window.navigator.language;
}
init({
  fallbackLocale: defaultLocale,
  initialLocale: initialLocale
});
