import type { Conversation } from '$lib/models/types/conversation.type';
import { get, writable } from 'svelte/store';

function createConversationsStore() {
    const conversations = writable<Conversation[]>([
        {id: '1', name: 'Conversation session 1'},
        {id: '2', name: 'Super long name that yould not fit'},
    ]);

    function remove(id: string): void {
        conversations.update((conversations) => {
            return conversations.filter((conversation) => conversation.id !== id);
        });
    }

    function add(conversation: Conversation): void {
        conversations.update((conversations) => {
            conversations.push(conversation);
            return conversations;
        });
    }

    function getById(id: string): Conversation | null {
        const _c = get(conversations);
        return _c.find((conversation) => conversation.id === id) || null;
    }

    return {
        subscribe: conversations.subscribe,
        remove,
        add,
        getById
    }
}

export const conversationsStore = createConversationsStore();