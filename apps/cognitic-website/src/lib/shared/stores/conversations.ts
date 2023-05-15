import { browser } from '$app/environment';
import { Log } from '$lib/core/services/logging';
import {
  addConversation,
  deleteConversation,
  getAllConversations,
  getConversation
} from '$lib/data/conversationQueries';
import { notificationStore } from '$lib/features/Notifications/store/notifications';
import { Conversation } from '$lib/models/classes/Conversation.class';
import { NotificationType, Position } from '$lib/models/enums/notifications';
import type { NewConversationDTO } from '$lib/models/types/conversation.type';
import type { DataStore } from '$lib/models/types/store.type';
import { _ } from 'svelte-i18n';
import { derived, get, writable, type Readable } from 'svelte/store';
import { user } from './user';

function createConversationsStore(): DataStore<
  Conversation,
  NewConversationDTO
> {
  const _t = get(_);
  const _conversations = writable<Conversation[]>([]);

  async function remove(id: string): Promise<boolean> {
    Log.DEBUG('createConversationsStore.remove', id);
    let removedConversation: Conversation | null = null;

    // optimistic update
    _conversations.update((conversations) => {
      const index = conversations.findIndex(
        (conversation) => conversation.value.id === id
      );
      if (index === -1) return conversations;
      removedConversation = conversations[index];
      conversations.splice(index, 1);
      return conversations;
    });
    const success = await deleteConversation(id);

    // rollback if failed + emit notification
    if (!success && removedConversation !== null) {
      _conversations.update((conversations) => {
        conversations.push(removedConversation!);
        return conversations;
      });
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: _t('notifications.failedDeleteAgent'),
        removeAfter: 5000,
        position: Position.BottomRight
      });
    }

    // emit notification
    if (success) {
      notificationStore.addNotification({
        type: NotificationType.GeneralSuccess,
        message: _t('notifications.agentDeleted'),
        removeAfter: 5000,
        position: Position.BottomRight
      });
    }

    return success;
  }

  async function add(
    conversation: NewConversationDTO
  ): Promise<Conversation | null> {
    Log.DEBUG('createConversationsStore.add', conversation);

    const resp = await addConversation(conversation);

    if (resp === null) {
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: _t('notifications.failedCreateAgent'),
        removeAfter: 5000,
        position: Position.BottomRight
      });
      return null;
    }

    const newConv = new Conversation(resp);

    _conversations.update((conversations) => {
      conversations.unshift(newConv);
      return conversations;
    });
    notificationStore.addNotification({
      type: NotificationType.GeneralSuccess,
      message: _t('notifications.agentCreated', {
        values: { name: newConv.value.title }
      }),
      removeAfter: 5000,
      position: Position.BottomRight
    });
    return newConv;
  }

  async function fetchFromServer(
    nextPage: boolean = false
  ): Promise<{ moreToFetch: boolean }> {
    Log.DEBUG('createConversationsStore.fetchFromerver');
    const fetchLimit = 10;
    const conversations = await getAllConversations({
      limit: fetchLimit,
      offset: nextPage ? get(_conversations).length : 0
    });
    const res: Conversation[] = conversations.map(
      (conv) => new Conversation(conv)
    );
    _conversations.update((current: Conversation[]) => {
      if (nextPage) {
        const newConversations = res.filter(
          (conv) => !current.some((a) => a.value.id === conv.value.id)
        );
        return [...current, ...newConversations];
      }

      return res.map((conv) => {
        const local = current.find(
          (conversation) => conversation.value.id === conv.value.id
        );
        if (
          local &&
          local.value.messages.length &&
          !conv.value.messages.length
        ) {
          return local;
        }
        return local || conv;
      });
    });

    return { moreToFetch: res.length >= fetchLimit };
  }

  async function fetchById(id: string): Promise<void> {
    Log.DEBUG('createConversationsStore.fetchConversationById', id);
    const conversation = await getConversation(id);
    if (conversation === null) {
      Log.ERROR('Error createConversationsStore.fetchConversationById', id);
    } else {
      _conversations.update((conversations) => {
        const index = conversations.findIndex(
          (conversation) => conversation.value.id === id
        );
        if (index === -1) {
          conversations.push(new Conversation(conversation));
          return conversations;
        }
        conversations[index] = new Conversation(conversation);
        return conversations;
      });
    }
  }

  function getById(id: string): Readable<Conversation | null> {
    Log.DEBUG('createConversationsStore.getById', id);
    return derived(_conversations, ($) => {
      const conversation = $.find((a) => a.value.id === id);
      return conversation || null;
    });
  }

  if (browser) {
    user.subscribe(() => {
      fetchFromServer();
    });
  }

  return {
    subscribe: _conversations.subscribe,
    remove,
    add,
    fetchById,
    getById,
    fetchFromServer
  };
}

export const conversationsStore = createConversationsStore();
