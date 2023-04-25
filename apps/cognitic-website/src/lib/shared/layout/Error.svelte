<script lang="ts">
  export let status: string | number;
  export let summary: string;
</script>

<div class="relative flex w-full items-center justify-center {$$props.class}">
  <div class="mx-auto max-w-xl sm:px-6 lg:px-8">
    <div class="flex items-center pt-8">
      <div
        class="body-large border-stroke-secondary text-content-primary border-r px-4 tracking-wider"
      >
        {status}
      </div>
      <div
        class="body-regular text-content-primary ml-4 uppercase tracking-wider"
      >
        {summary}
      </div>
    </div>
  </div>
</div>
