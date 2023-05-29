import type { RepositoryOption } from '$lib/models/types/conversation.type';
import { writable } from 'svelte/store';

export const selectedRepositoryStore = writable<RepositoryOption | null>(null);
