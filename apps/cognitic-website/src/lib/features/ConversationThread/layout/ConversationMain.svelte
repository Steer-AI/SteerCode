<script lang="ts">
  import type { Conversation } from '$lib/models/types/conversation.type';
  import Divider from '$lib/shared/components/Divider.svelte';

  export let conversation: Conversation;
</script>

<!--  conversation thread -->
<section class="flex-1 overflow-hidden">
  <!-- agent role -->
  <h3
    title={conversation.agent_role}
    class="bg-background-primary headline-large relative flex h-14 flex-1 cursor-default items-center overflow-hidden overflow-ellipsis whitespace-nowrap px-3"
  >
    {conversation.agent_role}

    <div
      class="from-background-primary absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l"
    />
  </h3>

  <Divider />

  <!-- agent goal -->
  <div class="px-3 py-1.5">
    <span class="label-small text-content-secondary">GOAL:</span>
    <p class="body-regular text-content-secondary">
      {conversation.agent_goal}
    </p>
  </div>

  <Divider />

  <!-- agent messages / progress -->
  <div>
    <!-- TODO: implement -->
  </div>
</section>
