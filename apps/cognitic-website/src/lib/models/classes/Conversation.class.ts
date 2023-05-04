import { Log } from '$lib/core/services/logging';
import { deleteMessage, getMessages } from '$lib/data/conversationQueries';
import { withLogger } from '$lib/shared/utils/decorators';
import type { ChatCompletionRequestMessage } from 'openai';
import {
  writable,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable
} from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type {
  ChatMessageDTO,
  ConversationDTO
} from '../types/conversation.type';

export class Conversation implements Readable<ConversationDTO> {
  readonly value: ConversationDTO;
  readonly store: Writable<ConversationDTO>;

  constructor(initialValue: ConversationDTO) {
    this.value = initialValue;
    this.store = writable<ConversationDTO>(initialValue);
  }

  _restore(valueKey: keyof ConversationDTO, snapshot: any) {
    this.value[valueKey] = snapshot;
    this.store.set(this.value);
  }

  subscribe(
    run: Subscriber<ConversationDTO>,
    invalidate?: ((value?: ConversationDTO | undefined) => void) | undefined
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  @withLogger()
  async addMessage(message: ChatCompletionRequestMessage): Promise<boolean> {
    this.value.messages.push({
      ...message,
      id: uuidv4(),
      conversation_id: this.value.id,
      created_at: new Date().toISOString()
    });
    this.store.set(this.value);
    return true;
  }

  @withLogger()
  async deleteMessage(message: ChatMessageDTO): Promise<boolean> {
    const snapshot = [...this.value.messages];

    this.value.messages = this.value.messages.filter(
      (m) => m.id !== message.id
    );
    this.store.set(this.value);

    const success = await deleteMessage(this.value.id, message.id);

    if (!success) {
      Log.DEBUG(
        'Conversation.deleteMessage',
        'failed to delete message. Restore snapshot'
      );
      this._restore('messages', snapshot);
    }

    return success;
  }

  @withLogger()
  async fetchMessages(): Promise<ChatMessageDTO[]> {
    const messages = await getMessages(this.value.id);
    this.value.messages = messages;
    this.store.set(this.value);
    return messages;
  }
}
