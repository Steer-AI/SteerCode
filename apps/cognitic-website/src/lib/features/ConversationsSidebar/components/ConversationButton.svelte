<script context="module" lang="ts">
  export type DispatchEvents = {
    delete: { original: MouseEvent; agent: Conversation };
  };
</script>

<script lang="ts">
  import { _ } from 'svelte-i18n';

  import Divider from '$lib/shared/components/Divider.svelte';
  import BinIcon from '$lib/shared/components/Icons/BinIcon.svelte';
  import MessagingIcon from '$lib/shared/components/Icons/MessagingIcon.svelte';
  import Tooltip from '$lib/shared/components/Tooltip.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Conversation } from '$lib/models/classes/Conversation.class';

  export let agent: Conversation;
  export let selected: boolean;

  const dispatch = createEventDispatcher<DispatchEvents>();
</script>

<li
  class="items text-content-secondary hover:text-content-primary group flex items-center px-3 {selected
    ? 'bg-background-primaryActive'
    : 'bg-background-primary hover:bg-background-primaryHover'}"
>
  <a
    href="/chat/{$agent.id}"
    class="relative flex h-10 flex-1 items-center overflow-hidden"
    title={$agent.title}
  >
    <MessagingIcon class="mr-2 h-4 w-4" />
    <span class="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
      {$agent.title}
    </span>
    <div
      class="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l {selected
        ? 'from-background-primaryActive'
        : 'from-background-primary group-hover:from-background-primaryHover'}"
    />
  </a>

  <Tooltip>
    <button
      slot="trigger"
      class="text-content-secondary hover:text-content-primary hidden group-hover:block"
      on:click={(e) => dispatch('delete', { original: e, agent })}
    >
      <BinIcon class="h-4 w-4" />
      <div class="sr-only">{$_('sidebar.deleteTooltip')}</div>
    </button>
    <svelte:fragment slot="tooltip"
      >{$_('sidebar.deleteTooltip')}</svelte:fragment
    >
  </Tooltip>
</li>
<Divider class="mx-3 last:hidden" />
