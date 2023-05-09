<script lang="ts">
  import Divider from '$lib/shared/components/Divider.svelte';
</script>

<div class="h-full overflow-auto">
  <h1 class="headline-large mb-14 px-6">Backgrounds</h1>
  <section class="grid grid-cols-3 place-content-center gap-x-3 gap-y-6 px-6">
    <div class="bg-background-primary aspect-square w-32">
      <p class="text-content-primary text-center">primary</p>
    </div>

    <div class="bg-background-primaryHover aspect-square w-32">
      <p class="text-content-primary text-center">primaryHover</p>
    </div>

    <div class="bg-background-primaryActive aspect-square w-32">
      <p class="text-content-primary text-center">primaryActive</p>
    </div>

    <div class="bg-background-secondary aspect-square w-32">
      <p class="text-content-secondary text-center">secondary</p>
    </div>

    <div class="bg-background-secondaryHover aspect-square w-32">
      <p class="text-content-secondary text-center">secondaryHover</p>
    </div>

    <div class="bg-background-secondaryActive aspect-square w-32">
      <p class="text-content-secondary text-center">secondaryActive</p>
    </div>

    <div class="bg-background-inverse aspect-square w-32">
      <p class="text-content-inverse text-center">inverse</p>
    </div>
  </section>

  <Divider class="my-10" />

  <h1 class="headline-large mb-14 px-6">Strokes</h1>
  <section class="grid grid-cols-2 place-content-center gap-x-3 gap-y-6 px-6">
    <div class="border-stroke-primary h-14 w-32 border-4 p-3">
      <p class="text-content-primary text-center">primary</p>
    </div>

    <div class="border-stroke-secondary h-14 w-32 border-4 p-3">
      <p class="text-content-primary text-center">secondary</p>
    </div>
  </section>

  <Divider class="my-10" />

  <h1 class="headline-large mb-14 px-6">Colors</h1>
  <section class="grid grid-cols-3 place-content-center gap-x-3 gap-y-6 px-6">
    <p class="headline-large text-content-primary">
      This is a content-primary text color
    </p>
    <p class="headline-large text-content-primarySub">
      This is a content-primarySub text color
    </p>

    <p class="headline-large text-content-secondary">
      This is a content-secondary text color
    </p>
    <p class="headline-large text-content-tertiary">
      This is a content-tertiary text color
    </p>

    <p class="headline-large text-primary-lighter">
      This is a primary-lighter text color
    </p>
    <p class="headline-large text-primary">This is a primary text color</p>
    <p class="headline-large text-primary-darker">
      This is a primary-darker text color
    </p>

    <p class="headline-large text-error-lighter">
      This is a error-lighter text color
    </p>
    <p class="headline-large text-error">This is a error text color</p>
    <p class="headline-large text-error-darker">
      This is a error-darker text color
    </p>

    <p class="headline-large text-success-lighter">
      This is a success-lighter text color
    </p>
    <p class="headline-large text-success">This is a success text color</p>
    <p class="headline-large text-success-darker">
      This is a success-darker text color
    </p>
  </section>

  <Divider class="my-10" />

  <h1 class="headline-large mb-14 px-6">Fonts</h1>
  <section class="grid grid-cols-3 place-content-center gap-x-3 gap-y-6 px-6">
    <p class="headline-large text-content-primary">
      This is a headline-large text. 1234567890
    </p>
    <p class="headline-small text-content-primary">
      This is a headline-small text. 1234567890
    </p>
    <p />

    <p class="body-regular-plus text-content-primary">
      This is a body-regular-plus text. 1234567890
    </p>
    <p class="body-regular text-content-primary">
      This is a body-regular text. 1234567890
    </p>
    <p class="body-small text-content-primary">
      This is a body-small text. 1234567890
    </p>

    <p class="label-small text-content-primary">
      This is a label-small text. 1234567890
    </p>
    <p class="label-small-plus text-content-primary">
      This is a label-small-plus text. 1234567890
    </p>
    <p />

    <p class="mono-small text-content-primary">
      This is a mono-small text. 1234567890
    </p>
    <p class="mono-small-plus text-content-primary">
      This is a mono-small-plus text. 1234567890
    </p>
    <p class="mono-regular text-content-primary">
      This is a mono-regular text. 1234567890
    </p>
    <p class="mono-regular-plus text-content-primary">
      This is a mono-regular-plus text. 1234567890
    </p>
  </section>
</div>
