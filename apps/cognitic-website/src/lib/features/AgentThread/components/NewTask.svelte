<script lang="ts" context="module">
  export type DispatchType = {
    add: string;
  };
</script>

<script lang="ts">
  import Button from '$lib/shared/components/Button.svelte';
  import CloseIcon from '$lib/shared/components/Icons/CloseIcon.svelte';
  import DoneIcon from '$lib/shared/components/Icons/DoneIcon.svelte';
  import PlusIcon from '$lib/shared/components/Icons/PlusIcon.svelte';
  import InputField from '$lib/shared/components/InputField.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<DispatchType>();
  let editMode = false;
  let taskName = '';
  let inputComp: InputField;

  function handleButtonClick() {
    if (!editMode) {
      editMode = true;
      inputComp.focus();
      return;
    }
    if (!taskName) {
      editMode = false;
      return;
    }
    dispatch('add', taskName);
    taskName = '';
    editMode = false;
  }
</script>

<div class="new-task-wrapper flex flex-1">
  <InputField
    bind:this={inputComp}
    bind:value={taskName}
    placeholder="Task name"
    labelClass="overflow-hidden h-8 {editMode ? 'flex-1' : 'w-0'}"
    class="body-regular placeholder:body-regular"
    on:keyup={(e) => {
      if (e.key === 'Enter') {
        handleButtonClick();
      }
    }}
  />

  <Button
    variant="secondary"
    size="medium"
    class={editMode ? '' : 'flex-1 overflow-hidden whitespace-nowrap'}
    on:click={handleButtonClick}
  >
    {#if editMode && !taskName}
      <CloseIcon class="h-3 w-3" />
    {:else if editMode && taskName}
      <DoneIcon class="h-3 w-3" />
    {:else if editMode}
      <PlusIcon class="h-3 w-3" />
    {:else}
      <PlusIcon class="mr-1 h-3 w-3" />
      Add task
    {/if}
  </Button>
</div>

<style>
  .new-task-wrapper :global(> *) {
    transition: flex 0.2s ease-in-out;
  }
</style>
