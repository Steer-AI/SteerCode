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
</script>

<div class="not-prose h-full w-full" style="min-width: 256px">
  <pre class="{highlighted.language} hljs bg h-full p-3">
      <code class="mono-regular">{@html highlighted.value}</code>
    </pre>
</div>
