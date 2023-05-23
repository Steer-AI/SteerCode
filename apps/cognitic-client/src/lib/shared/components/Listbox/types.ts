import type { SvelteComponentConstructor } from '$lib/models/types/svelte';

export type Option<T = any> = {
  label: string;
  value: T;
  disabled?: boolean;
  renderComponent?: SvelteComponentConstructor<T>;
  [key: string]: any;
};
