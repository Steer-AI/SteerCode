import type { SvelteComponentTyped } from 'svelte';

export declare type SvelteComponentConstructor<T> = new (
  ...args: unknown
) => SvelteComponentTyped<T>;

// This returns all the component's properties as a Partial: { prop1?: string, ... }
export declare type ComponentProperties<
  T extends { $set: (...args: unknown) => unknown }
> = NonNullable<Parameters<T['$set']>[0]>;

// This returns the type of a specific property
export declare type ComponentPropertyType<
  T extends { $set: (...args: unknown) => unknown },
  P extends keyof ComponentProperties<T>
> = NonNullable<ComponentProperties<T>[P]>;
