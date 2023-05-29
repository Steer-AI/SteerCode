<script lang="ts">
  export let filled: boolean = true;
</script>

{#if filled}
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...$$props}
  >
    <g clip-path="url(#clip0_629_11293)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 0H0V12H12V0ZM5.25 2.75H6.75V4.25H5.25V2.75ZM5.25 5.25H6.75V9.25H5.25V5.25Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_629_11293">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
{:else}
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 17 16"
    class={$$props.class}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="7.83301"
      y="4.6665"
      width="1.33333"
      height="1.33333"
      fill="currentColor"
    />
    <rect
      x="7.83301"
      y="7.3335"
      width="1.33333"
      height="4"
      fill="currentColor"
    />
    <rect
      x="3.16667"
      y="2.66667"
      width="10.6667"
      height="10.6667"
      stroke="currentColor"
      stroke-width="1.33333"
    />
  </svg>
{/if}
