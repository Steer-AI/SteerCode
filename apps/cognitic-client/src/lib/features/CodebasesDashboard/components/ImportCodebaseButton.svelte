<script lang="ts">
    import FolderIcon from "$lib/shared/components/Icons/FolderIcon.svelte";
    import PlusIcon from "$lib/shared/components/Icons/PlusIcon.svelte";
</script>

<button class="w-[400px] text-content-primary border border-solid border-stroke-secondary px-6 pb-6 pt-5 flex justify-between items-center">
    <div class="flex items-center">
        <FolderIcon class="mr-3.5 h-6 w-6 text-content-primarySub" />
        <p class="text-xl text-content-primary font-bold">
            Open local codebase
        </p>
    </div>
    <div class="text-content-tertiary">
        <PlusIcon class="h-6 w-6" />
    </div>
</button>