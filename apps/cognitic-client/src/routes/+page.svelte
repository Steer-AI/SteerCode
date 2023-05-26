<script lang="ts">
    import Header from '$lib/shared/layout/Header.svelte';
    import ConversationLanding from './ConversationLanding.svelte';

    import { recentRepositories } from '$lib/shared/stores/recentRepositories';
    
</script>

<Header />
<div>
    <ConversationLanding />
</div>

