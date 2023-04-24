<script>
  export let active = true;
  export let activeClass = 'bg-success';
</script>

{#if !active}
  <svg
    width="6"
    height="8"
    viewBox="0 0 6 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={$$props.class}
  >
    <path d="M0 0.5V7.5H2V0.5H0ZM4 0.5V7.5H6V0.5H4Z" fill="#737882" />
  </svg>
{:else}
  <span class="relative flex h-1.5 w-1.5 {$$props.class}" class:active>
    <span
      class:hidden={!active}
      class="absolute inline-flex h-full w-full animate-ping opacity-75 {active
        ? activeClass
        : 'bg-content-secondary'}"
    />
    <span
      class="relative m-auto inline-flex h-1 w-1 {active
        ? activeClass
        : 'bg-content-secondary'}"
    />
  </span>
{/if}
