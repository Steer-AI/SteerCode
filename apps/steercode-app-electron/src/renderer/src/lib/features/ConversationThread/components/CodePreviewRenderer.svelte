<script lang="ts">
  import hljs from 'highlight.js';
  import { _ } from 'svelte-i18n';
  import { parse } from 'diff2html';
  import { selectedRepositoryStore } from '$lib/shared/stores/selectedRepository';

  let fileName: string = '';
  export let lang: string;
  export let text: string;

  const isDiff = isEmptyDiff(text);

  function isEmptyDiff(diff: string): boolean {
    const change = parse(diff);
    if (change.length > 0) {
      fileName = change[0].newName;
      if ($selectedRepositoryStore) {
        fileName = fileName.replace($selectedRepositoryStore?.url, '');
      }
    }
    return change.length > 0;
  }

  function highlight(code: string, lang: string | undefined) {
    if (isDiff) {
      lang = 'diff';
    }

    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight('\n' + code, { language: lang });
    }
    return hljs.highlightAuto('\n' + code, [
      'typescript',
      'python',
      'bash',
      'java',
      'cpp',
      'javascript',
      'go',
      'ruby',
      'dart',
      'rust',
      'html'
    ]);
  }

  $: highlighted = highlight(text, lang);

  $: newLinesBlocks = highlighted.value.split('\n');

  let scrollOffset: number = 0;
  let el1: HTMLElement;
  let el2: HTMLElement;
</script>

<div class="not-prose flex h-full w-full" style="min-width: 256px">
  <div
    bind:this={el1}
    class="bg-background-primaryHover hide-scrollbar w-14 overflow-x-auto p-3"
    on:scroll={(e) => {
      if (e.target.scrollTop === scrollOffset) return;
      scrollOffset = e.target.scrollTop;
      el2.scrollTop = scrollOffset;
    }}
  >
    {#each newLinesBlocks as _, index}
      <span
        class="text-content-secondary mono-small flex w-full items-center justify-end"
        style="height: 20px">{index + 1}</span
      >
    {/each}
  </div>
  <div
    bind:this={el2}
    class="{highlighted.language} hljs mono-regular w-full p-3"
    style="white-space-collapse: preserve"
    on:scroll={(e) => {
      if (e.target.scrollTop === scrollOffset) return;
      scrollOffset = e.target.scrollTop;
      el1.scrollTop = scrollOffset;
    }}
  >
    {#each newLinesBlocks as line}
      <span class="block w-full" style="height: 20px">{@html line}</span>
    {/each}
  </div>
</div>
