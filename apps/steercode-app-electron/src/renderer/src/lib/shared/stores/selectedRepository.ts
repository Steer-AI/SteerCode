import type { RepositoryOption } from '$lib/models/types/conversation.type';
import type { IFileTreeItem } from 'cognitic-models';
import { writable } from 'svelte/store';

export const selectedRepositoryStore = writable<RepositoryOption | null>(null);

export const initialFileTreeFile = writable<IFileTreeItem | null>(null);
