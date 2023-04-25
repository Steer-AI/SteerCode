import { Log } from '$lib/core/services/logging';
import { fetchConversations, newConversation, removeConversation } from '$lib/data/conversationsQueries';
import { notificationStore } from '$lib/features/Notifications/store/notifications';
import { NotificationType, Position } from '$lib/models/enums/notifications';
import type { Conversation, Task } from '$lib/models/types/conversation.type';
import { localStorageWritable } from '$lib/shared/utils/localShorageStore';
import { derived, type Readable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

function createConversationsStore() {
    const _conversations = localStorageWritable<Conversation[]>('cognitic.conversations', []);

    async function remove(id: string): Promise<boolean> {
        Log.DEBUG('createConversationsStore.remove', id);
        let removedConversation: Conversation | null = null;

        // optimistic update
        _conversations.update((conversations) => {
            const index = conversations.findIndex((conversation) => conversation.id === id);
            if (index === -1) return conversations;
            removedConversation = conversations[index];
            conversations.splice(index, 1);
            return conversations
        });
        const success = await removeConversation(id);

        // rollback if failed + emit notification
        if (!success && removedConversation !== null) {
            _conversations.update((conversations) => {
                conversations.push(removedConversation!);
                return conversations
            });
            notificationStore.addNotification({
                type: NotificationType.GeneralError,
                text: 'Failed to remove conversation',
                removeAfter: 5000,
                position: Position.BottomRight
            })
        } 

        // emit notification
        if (success) {
            notificationStore.addNotification({
                type: NotificationType.GeneralSuccess,
                text: 'Conversation removed',
                removeAfter: 5000,
                position: Position.BottomRight
            })
        }


        return success;
    }

    async function add(agentName: string, agentRole: string, agentGoal: string): Promise<Conversation> {
        Log.DEBUG('createConversationsStore.add', {agentName, agentRole, agentGoal});
        const _conversation = await newConversation(agentName, agentRole, agentGoal);
        _conversations.update((conversations) => {
            conversations.push(_conversation);
            return conversations;
        });
        return _conversation
    }

    async function fetchFromServer(): Promise<Conversation[]> {
        Log.DEBUG('createConversationsStore.fetchFromerver');
        const conversations = await fetchConversations();
        _conversations.set(conversations);
        return conversations;
    }

    function getById(id: string): Readable<Conversation | null> {
        Log.DEBUG('createConversationsStore.getById', id);
        return derived(_conversations, ($) => $.find(c => c.id === id) || null);
    }

    function removeTaskByIndex(id: string, index: number) {
        Log.DEBUG('createConversationsStore.removeTaskByIndex', {id, index});
        _conversations.update((conversations) => {
            const conversation = conversations.find(c => c.id === id);
            if (!conversation) return conversations;
            conversation.tasks.splice(index, 1);
            return conversations;
        });
    }

    function addTaskToIndex(id: string, index: number, taskName: string) {
        Log.DEBUG('createConversationsStore.addTaskToIndex', {id, index, taskName});
        _conversations.update((conversations) => {
            const conversation = conversations.find(c => c.id === id);
            if (!conversation) return conversations;
            const task: Task = {
                id: uuidv4(),
                name: taskName,
                status: 'waiting',
                result: null,
                steps: []
            }
            conversation.tasks.splice(index, 0, task);
            return conversations;
        });
    }

    function restoreTasks(id: string, tasks: Task[]) {
        Log.DEBUG('createConversationsStore.restoreTasks', {id, tasks});
        _conversations.update((conversations) => {
            const conversation = conversations.find(c => c.id === id);
            if (!conversation) return conversations;
            conversation.tasks = tasks;
            return conversations;
        });
    }

    return {
        subscribe: _conversations.subscribe,
        remove,
        add,
        fetchFromServer,
        getById,
        removeTaskByIndex,
        addTaskToIndex,
        restoreTasks
    }
}

export const conversationsStore = createConversationsStore();