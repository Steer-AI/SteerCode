<script lang="ts">
  import type { ChatCompletionRequestMessageRoleEnum } from 'openai';
  export let type: ChatCompletionRequestMessageRoleEnum;
  export let message: string;
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
  <div class="chat-image avatar">
    <div class="w-10 overflow-hidden rounded-full">
      <img
        src="https://ui-avatars.com/api/?name={type === 'user'
          ? 'Me'
          : 'B'}&size=40&background={type === 'user'
          ? '46B95F'
          : 'FFDC00'}&color=000"
        alt="{type} avatar"
      />
    </div>
  </div>
  <div class="chat-header label-mini">
    {type === 'user' ? 'Me' : 'Bot'}
  </div>
  <div
    class="chat-bubble text-content-primary {type === 'user'
      ? 'bg-background-secondary'
      : 'bg-background-secondaryActive'}"
  >
    {message}
  </div>
</div>

<style>
  .chat {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 0.75rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  .chat-image {
    grid-row: span 2 / span 2;
    align-self: flex-end;
  }
  .avatar {
    position: relative;
    display: inline-flex;
  }
  .chat-start {
    place-items: start;
    grid-template-columns: auto 1fr;
  }

  .chat-end {
    place-items: end;
    grid-template-columns: 1fr auto;
  }

  .chat-bubble {
    position: relative;
    display: block;
    width: -moz-fit-content;
    width: fit-content;
    padding: 0.5rem 1rem;
    max-width: 90%;
    border-radius: var(--rounded-box, 1rem);
    min-height: 2.75rem;
    min-width: 2.75rem;
  }

  .chat-header {
    grid-row-start: 1;
  }

  .chat-start .chat-image {
    grid-column-start: 1;
  }

  .chat-start .chat-header,
  .chat-start .chat-footer {
    grid-column-start: 2;
  }

  .chat-start .chat-bubble {
    grid-column-start: 2;
    border-bottom-left-radius: 0;
  }

  .chat-end .chat-image {
    grid-column-start: 2;
  }
  .chat-end .chat-bubble {
    grid-column-start: 1;
    border-bottom-right-radius: 0;
  }
  .chat-end .chat-header,
  .chat-end .chat-footer {
    grid-column-start: 1;
  }
</style>
