<script lang="ts">
  import { recentRepositories } from '$lib/shared/stores/recentRepositories';
  import CodebaseButton from '$lib/features/CodebasesDashboard/components/CodebaseButton.svelte';
  import ImportCodebaseButton from '$lib/features/CodebasesDashboard/components/ImportCodebaseButton.svelte';
</script>

<div class="px-6">
  <section class="mb-12 mt-6 w-full">
    <ImportCodebaseButton />
  </section>
  <h2 class="text-content-primary mb-6 text-xl font-bold">Projects</h2>
  <section class="grid-cols-auto-400 grid gap-x-12 gap-y-6">
    {#each $recentRepositories as repository (repository.url)}
      <CodebaseButton {repository} />
    {:else}
      <p>No recent projects</p>
    {/each}
  </section>
</div>
