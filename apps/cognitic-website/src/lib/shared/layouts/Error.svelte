<script lang="ts">
  export let status: string | number;
  export let summary: string;
</script>

<div
  class="items-top relative flex min-h-screen justify-center sm:items-center sm:pt-0"
>
  <div class="mx-auto max-w-xl sm:px-6 lg:px-8">
    <div class="flex items-center pt-8 sm:justify-start sm:pt-0">
      <div
        class="body-regular border-r border-gray-400 px-4 tracking-wider text-gray-500"
      >
        {status}
      </div>
      <div class="body-regular ml-4 uppercase tracking-wider text-gray-500">
        {summary}
      </div>
    </div>
  </div>
</div>
