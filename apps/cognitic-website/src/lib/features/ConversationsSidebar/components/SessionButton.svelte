<script context="module" lang="ts">
  export type DispatchEvents = {
    delete: { original: MouseEvent; conversationId: string };
  };
</script>

<script lang="ts">
  import type { Conversation } from '$lib/models/types/conversation.type';
  import Divider from '$lib/shared/components/Divider.svelte';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import MessagingIcon from '$lib/shared/components/Icons/MessagingIcon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let conversation: Conversation;
  export let selected: boolean;

  const dispatch = createEventDispatcher<DispatchEvents>();
</script>

<li
  class="items group flex h-10 items-center px-3 {selected
    ? 'bg-background-secondaryActive'
    : 'bg-background-secondary hover:bg-background-secondaryHover'}"
>
  <a
    href="/chat/{conversation.id}"
    class="relative flex flex-1 items-center overflow-hidden"
  >
    <MessagingIcon class="mr-1 h-4 w-4" />
    <span class="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
      >{conversation.name}</span
    >
    <div
      class="absolute right-0 z-10 h-full w-8 bg-gradient-to-l {selected
        ? 'from-background-secondaryActive'
        : 'from-background-secondary group-hover:from-background-secondaryHover'}"
    />
  </a>

  <button
    class:hidden={!selected}
    class="text-content-secondary hover:text-content-primary"
    on:click={(e) =>
      dispatch('delete', { original: e, conversationId: conversation.id })}
  >
    <BinIcon class="h-4 w-4" />
  </button>
</li>
<Divider class="last:hidden" />
