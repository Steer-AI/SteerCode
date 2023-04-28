<script lang="ts">
  import hljs from 'highlight.js';

  export let lang: string;
  export let text: string;

  $: highlighted = hljs.highlight(text, {
    language: lang || 'plaintext'
  }).value;
</script>

<pre class={lang}><code>{@html highlighted}</code></pre>
