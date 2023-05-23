<script lang="ts">
  import jazzicon from '@metamask/jazzicon';
  import { beforeUpdate } from 'svelte';

  export let identifier: string;
  export let size: number;

  let icon: string;

  function strToSeedNumber(str: string): number {
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed = seed + 31 + str.charCodeAt(i);
    }
    return seed;
  }

  beforeUpdate(() => {
    const i = jazzicon(size, strToSeedNumber(identifier)) as HTMLDivElement;
    i.style.borderRadius = '0';
    i.style.minWidth = size + 'px';
    i.style.minHeight = size + 'px';
    i.style.border = '2px solid black';
    i.style.boxSizing = 'border-box';
    icon = i.outerHTML;
  });
</script>

{@html icon}
