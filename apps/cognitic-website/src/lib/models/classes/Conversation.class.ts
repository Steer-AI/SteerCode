import { Log } from '$lib/core/services/logging';
import { updateConversation } from '$lib/data/conversationQueries';
import { withLogger } from '$lib/shared/utils/decorators';
import type { ChatCompletionRequestMessage } from 'openai';
import {
  writable,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable
} from 'svelte/store';
import type { ConversationDTO } from '../types/conversation.type';

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
    const snapshot = [...this.value.messages];

    this.value.messages.push(message);
    this.store.set(this.value);

    const success = await updateConversation(this.value);

    if (!success) {
      Log.DEBUG('Agent.addTask', 'failed to add task. Restore snapshot');
      this._restore('messages', snapshot);
    }

    return success;
  }
}
