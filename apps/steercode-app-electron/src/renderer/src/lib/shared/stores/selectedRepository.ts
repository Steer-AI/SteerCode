import type { IFileTreeItem } from 'cognitic-models';
import { writable } from 'svelte/store';

export const initialFileTreeFile = writable<IFileTreeItem | null>(null);
