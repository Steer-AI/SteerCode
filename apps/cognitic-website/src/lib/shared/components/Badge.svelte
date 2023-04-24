<script lang="ts">
  export let secondary: boolean = false;
</script>

<div
  class:bg-background-secondaryActive={secondary}
  class:bg-background-secondary={!secondary}
  class="label-mini-plus text-content-primarySub flex h-5 items-center whitespace-nowrap px-1.5 {$$props.class}"
>
  <slot />
</div>
