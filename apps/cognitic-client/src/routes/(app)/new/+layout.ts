import { conversationsStore } from '$lib/shared/stores/conversations';
import type { LayoutLoad } from './$types'

export const load = (async () => {
  conversationsStore.fetchFromServer();
}) satisfies LayoutLoad;
