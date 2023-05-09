<script lang="ts">
  export let dark: boolean = false;
</script>

<svg
  width="100%"
  height="100%"
  viewBox="0 0 500 500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={$$props.class}
>
  <circle
    cx="206.373"
    cy="108.565"
    r="44.565"
    fill={dark ? 'black' : 'white'}
  />
  <circle cx="374.314" cy="174.709" r="80.291" class="fill-primary" />
  <circle
    cx="142.574"
    cy="292.925"
    r="97.576"
    fill={dark ? 'black' : 'white'}
  />
  <circle
    cx="338.661"
    cy="372.673"
    r="63.796"
    fill={dark ? 'black' : 'white'}
  />
</svg>
