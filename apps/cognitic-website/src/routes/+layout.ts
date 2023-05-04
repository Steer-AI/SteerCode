import '../styles/scrollbar.css';
import '../styles/tailwind.css';
import '../styles/typography.css';

import { browser } from '$app/environment';
import '$lib/core/services/i18n';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const prerender = false;
export const ssr = true;
export const csr = true;

export const load: LayoutLoad = async () => {
  if (browser) {
    const localeFromLS = localStorage.getItem('cognitic.locale');
    const localeFromNavigator = window.navigator.language;
    console.log('localeFromLS', localeFromLS, localeFromNavigator);
    locale.set(localeFromLS || localeFromNavigator);
  }
  await waitLocale();
};
