<script lang="ts" context="module">
  export type DispatchType = {
    add: string;
  };
</script>

<script lang="ts">
  import Button from '$lib/shared/components/Button.svelte';
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

<div class="new-task-wrapper mx-3 mt-4 flex">
  <InputField
    bind:this={inputComp}
    bind:value={taskName}
    placeholder="Task name"
    labelClass="overflow-hidden {editMode ? 'flex-1' : 'w-0'}"
    class="w-full"
    on:keyup={(e) => {
      if (e.key === 'Enter') {
        handleButtonClick();
      }
    }}
  />

  <Button
    variant="tertiary"
    size="small"
    class={editMode ? '' : 'flex-1 overflow-hidden whitespace-nowrap'}
    on:click={handleButtonClick}
  >
    <PlusIcon class="{editMode ? '' : 'mr-1'} h-3 w-3" />
    {!editMode ? 'Add task' : ''}
  </Button>
</div>

<style>
  .new-task-wrapper :global(> *) {
    transition: flex 0.2s ease-in-out;
  }
</style>
