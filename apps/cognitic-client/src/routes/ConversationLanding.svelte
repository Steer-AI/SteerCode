<script lang="ts">
    import { recentRepositories } from '$lib/shared/stores/recentRepositories';
    import CodebaseButton from "$lib/features/CodebasesDashboard/components/CodebaseButton.svelte";
    import type { RepositoryOption } from '$lib/models/types/conversation.type';
    import Header from '$lib/shared/layout/Header.svelte';
  import ImportCodebaseButton from '$lib/features/CodebasesDashboard/components/ImportCodebaseButton.svelte';

    const fetchData = async () => {
        // tmp mock

        const mock = [{
            name: 'svelte',
            url: '~/projects/svelte'
        }, {
            name: 'cognitic',
            url: '~/projects/cognitic'
        }, {
            name: 'cognitic-client',
            url: '~/projects/cognitic-client'
        }, {
            name: 'cognitic-server',
            url: '~/projects/cognitic-server'
        }, {
            name: 'SuperGPT',
            url: '~/projects/SuperGPT'
        }] as RepositoryOption[]
        mock.forEach(repo => recentRepositories.add(repo))
    }
    fetchData()
    
</script>
<div class="px-6">
    <section class="w-full mt-6 mb-12">
        <ImportCodebaseButton />
    </section>
    <h2 class="font-bold text-xl text-content-primary mb-6">
        Projects
    </h2>
    <section class="grid grid-cols-auto-400 gap-x-12 gap-y-6">
        {#each $recentRepositories as repository (repository.url)}
            <CodebaseButton {repository} />
            {:else}
            <p>No recent projects</p>
        {/each}
    </section>
</div>
