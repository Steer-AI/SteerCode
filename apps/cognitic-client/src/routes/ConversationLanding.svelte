<script lang="ts">
    import { recentRepositories } from '$lib/shared/stores/recentRepositories';
    import CodebaseButton from "$lib/features/CodebasesDashboard/components/CodebaseButton.svelte";
    import type { RepositoryOption } from '$lib/models/types/conversation.type';

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


<section>
    {#each $recentRepositories as repository (repository.url)}
        <CodebaseButton {repository} />
        {:else}
        <p>No recent projects</p>
    {/each}
</section>