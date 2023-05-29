<script lang="ts">
  import CodebaseButton from '$lib/features/CodebasesDashboard/components/CodebaseButton.svelte';
  import ImportCodebaseButton from '$lib/features/CodebasesDashboard/components/ImportCodebaseButton.svelte';
  import Header from '$lib/shared/layout/Header.svelte';
  import { recentRepositories } from '$lib/shared/stores/recentRepositories';
  import { _ } from 'svelte-i18n';
</script>

<Header style="max-width: 100vw" sidebarOpen={false} enableMenuButton={false} />
<div>
  <div class="px-6">
    <section class="mb-12 mt-6 w-full">
      <ImportCodebaseButton />
    </section>
    <h2 class="text-content-primary mb-6 text-xl font-bold">
      {$_('dashboard.projects')}
    </h2>
    <section class="grid-cols-auto-400 grid gap-x-12 gap-y-6">
      {#each $recentRepositories as repository (repository.url)}
        <CodebaseButton {repository} />
      {:else}
        <p>{$_('dashboard.noRecentProjects')}s</p>
      {/each}
    </section>
  </div>
</div>
